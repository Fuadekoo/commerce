"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { Decimal } from "@prisma/client/runtime/library";

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

// import { Prisma } from "@prisma/client";

export async function makeSmartOrder() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { message: "Unauthorized", products: [] };
  }

  // 1. Check user balance
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true, todayTask: true, totalTask: true, leftTask: true },
  });
  if (!user) return { message: "User not found", products: [] };
  // Use Prisma.Decimal for comparison
  if (!user.balance || user.balance <= 0) {
    return { message: "Insufficient balance", products: [] };
  }

  // 2. Check for profit card
  const profitCard = await prisma.profitCard.findFirst({
    where: { userId: session.user.id },
    orderBy: { orderNumber: "asc" },
  });

  // 3. If profit card found, use its orderNumber, else default to 60
  const orderNumber = profitCard?.orderNumber ?? 60;

  // 4. If leftTask > 0 and profit card exists, use leftTask logic
  if (profitCard && (user.leftTask ?? 0) > 0) {
    // Get products up to profit card's orderNumber
    const products = await prisma.product.findMany({
      where: { orderNumber: { lte: orderNumber } },
      orderBy: { orderNumber: "asc" },
    });

    // Update user tasks and balance
    const newLeftTask = Math.max((user.leftTask ?? 0) - 1, 0);
    const newTotalTask = (user.totalTask ?? 0) + orderNumber;
    // Use Prisma.Decimal for arithmetic
    const newBalance = user.balance + orderNumber * 15;

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        leftTask: newLeftTask,
        totalTask: newTotalTask,
        balance: newBalance,
      },
    });

    return {
      message: "Profit card found, used leftTask",
      products,
      profitCard,
    };
  }

  // 5. If leftTask is 0, use todayTask logic
  if ((user.todayTask ?? 0) >= orderNumber) {
    // Get products (all if no profit card, or up to orderNumber if profit card)
    let products;
    if (profitCard) {
      products = await prisma.product.findMany({
        where: { orderNumber: { lte: orderNumber } },
        orderBy: { orderNumber: "asc" },
      });
    } else {
      products = await prisma.product.findMany({
        orderBy: { orderNumber: "asc" },
      });
    }

    // Update user tasks and balance
    const newTodayTask = Math.max((user.todayTask ?? 0) - orderNumber, 0);
    const newTotalTask = (user.totalTask ?? 0) + orderNumber;
    const newBalance = user.balance + orderNumber * 15;

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        todayTask: newTodayTask,
        totalTask: newTotalTask,
        balance: newBalance,
      },
    });

    return {
      message: profitCard
        ? "Profit card found, used todayTask"
        : "No profit card found, used todayTask",
      products,
      profitCard,
    };
  }

  // 6. If not enough leftTask or todayTask
  return {
    message: "No tasks available or not enough todayTask",
    products: [],
  };
}
