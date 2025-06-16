"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function getNotification() {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const notifications = await prisma.message.findMany({
    where: {
      OR: [{ userId: session.user.id }, { userId: null }],
    },
    orderBy: { createdAt: "desc" },
  });

  return notifications;
}
