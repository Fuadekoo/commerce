"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

// fristly check the profit card in login userid if found then return until the profit card order number found equal product ordernumber
// if not found the product card for this user then return all product by order in orderNumber\
// if the profit card found then return the profit card data help me only return the profit card find the first ordernumber only
// if the profit card not found then return all product by order in orderNumber
// return with a message
export async function makeOrder() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  // Get user info for task counts
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { todayTask: true, totalTask: true, leftTask: true },
  });
  if (!user) throw new Error("User not found");

  // Check if the user has a profit card
  const profitCard = await prisma.profitCard.findFirst({
    where: { userId: session.user.id },
    orderBy: { orderNumber: "asc" },
  });

  if (profitCard) {
    // Only return products up to the profit card's orderNumber
    const products = await prisma.product.findMany({
      where: { orderNumber: { lte: profitCard.orderNumber } },
      orderBy: { orderNumber: "asc" },
    });

    if (profitCard && user.leftTask && user.leftTask > 0) {
      // You can add any additional logic here if needed when leftTask is greater than 0
    }

    // Calculate new task values
    const decrementValue = profitCard.orderNumber;
    const newLeftTask = Math.max((user.leftTask ?? 0) - 1, 0);
    const newTodayTask = Math.max((user.todayTask ?? 0) - decrementValue, 0);
    const newTotalTask = (user.totalTask ?? 0) + decrementValue;

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        leftTask: newLeftTask,
        todayTask: newTodayTask,
        totalTask: newTotalTask,
      },
    });

    return { message: "Profit card found", products, profitCard };
  } else {
    // No profit card, return all products
    const products = await prisma.product.findMany({
      orderBy: { orderNumber: "asc" },
    });

    // Use a default decrement value (e.g., 60)
    const decrementValue = 60;
    const newLeftTask = Math.max(user.leftTask ?? 0, 0); // No decrement
    const newTodayTask = Math.max((user.todayTask ?? 0) - decrementValue, 0);
    const newTotalTask = (user.totalTask ?? 0) + decrementValue;

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        leftTask: newLeftTask,
        todayTask: newTodayTask,
        totalTask: newTotalTask,
      },
    });

    return {
      message: "No profit card found, returning all products",
      products,
    };
  }
}

export async function madeOrder() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  // Get user info for task counts
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { todayTask: true, totalTask: true, leftTask: true },
  });
  if (!user) throw new Error("User not found");

  // Check if the user has a profit card
  const profitCard = await prisma.profitCard.findFirst({
    where: { userId: session.user.id },
    orderBy: { orderNumber: "asc" },
  });

  // 1. Check if leftTask is 0
  if ((user.leftTask ?? 0) === 0) {
    return { message: "No left tasks available", products: [] };
  }

  // 2. Check if todayTask > 0
  if ((user.todayTask ?? 0) > 0) {
    let decrementValue = 0;
    let products = [];
    if (profitCard) {
      decrementValue = profitCard.orderNumber;
      // Get products up to profitCard.orderNumber
      products = await prisma.product.findMany({
        where: { orderNumber: { lte: profitCard.orderNumber } },
        orderBy: { orderNumber: "asc" },
      });
    } else {
      decrementValue = 60; // default value if no profit card
      products = await prisma.product.findMany({
        orderBy: { orderNumber: "asc" },
      });
    }

    // Update user tasks
    const newTodayTask = Math.max((user.todayTask ?? 0) - decrementValue, 0);
    const newTotalTask = (user.totalTask ?? 0) + decrementValue;
    const newLeftTask = Math.max((user.leftTask ?? 0) - 1, 0);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        todayTask: newTodayTask,
        totalTask: newTotalTask,
        leftTask: newLeftTask,
      },
    });

    return {
      message: profitCard
        ? "Profit card found, returning products up to profit card order number"
        : "No profit card found, returning all products",
      products,
      profitCard,
    };
  } else {
    return { message: "No today tasks available", products: [] };
  }
}
