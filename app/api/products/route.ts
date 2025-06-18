import { auth } from "@/lib/auth"; // your auth logic
import prisma from "@/lib/db";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const session = await auth();

      if (!session || !session.user || !session.user.id) {
        controller.enqueue(
          encoder.encode(JSON.stringify({ error: "Unauthorized" }) + "\n")
        );
        controller.close();
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { todayTask: true, totalTask: true, leftTask: true },
      });

      if (!user) {
        controller.enqueue(
          encoder.encode(JSON.stringify({ error: "User not found" }) + "\n")
        );
        controller.close();
        return;
      }

      if ((user.leftTask ?? 0) === 0) {
        controller.enqueue(
          encoder.encode(
            JSON.stringify({ message: "No left tasks available" }) + "\n"
          )
        );
        controller.close();
        return;
      }

      if ((user.todayTask ?? 0) === 0) {
        controller.enqueue(
          encoder.encode(
            JSON.stringify({ message: "No today tasks available" }) + "\n"
          )
        );
        controller.close();
        return;
      }

      let decrementValue = 0;
      let products = [];
      const profitCard = await prisma.profitCard.findFirst({
        where: { userId: session.user.id },
        orderBy: { orderNumber: "asc" },
      });

      if (profitCard) {
        decrementValue = profitCard.orderNumber;
        products = await prisma.product.findMany({
          where: { orderNumber: { lte: profitCard.orderNumber } },
          orderBy: { orderNumber: "asc" },
        });
      } else {
        decrementValue = 60;
        products = await prisma.product.findMany({
          orderBy: { orderNumber: "asc" },
        });
      }

      // Update task data
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          todayTask: Math.max((user.todayTask ?? 0) - decrementValue, 0),
          totalTask: (user.totalTask ?? 0) + decrementValue,
          leftTask: Math.max((user.leftTask ?? 0) - 1, 0),
        },
      });

      // FIRST SEND INFO MESSAGE
      const message = profitCard
        ? "Profit card found, streaming products up to profit card order number"
        : "No profit card found, streaming all products";
      controller.enqueue(encoder.encode(JSON.stringify({ message }) + "\n"));

      // STREAM PRODUCTS ONE BY ONE
      for (const product of products) {
        await new Promise((res) => setTimeout(res, 300)); // Optional delay
        controller.enqueue(encoder.encode(JSON.stringify({ product }) + "\n"));
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
    },
  });
}
