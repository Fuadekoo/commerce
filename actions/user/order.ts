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

export async function makeTrick() {
  // 1. Authentication
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized",
      products: [],
    };
  }

  try {
    // 2. Data Fetching
    const [user, profitCard] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { todayTask: true, totalTask: true, leftTask: true },
      }),
      prisma.profitCard.findFirst({
        where: { userId: session.user.id },
        orderBy: { orderNumber: "asc" },
      }),
    ]);

    const product = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (!user)
      return {
        success: false,
        message: "User not found",
        products: [],
      };

    // 3. State Variables
    const A = user.todayTask > 0; // Today Task exists
    const B = user.leftTask > 0; // Left Task exists
    const C = !!profitCard; // Profit Card exists
    const profitValue = profitCard?.orderNumber || 0;

    // 4. Switch-Case for All 8 Possibilities
    let message: string;
    let products = product; // Default to all products if no specific logic applies
    let updates = {};

    switch (true) {
      /* CASE 1: A=true, B=true, C=true */
      case A && B && C:
        message = "return only profit card";
        // return onlt rhe profit card
        updates = [profitCard];
        // products = await getProducts(profitValue);
        // updates = {
        //   todayTask: Math.max(user.todayTask - profitValue, 0),
        //   leftTask: user.leftTask - 1,
        //   totalTask: user.totalTask + profitValue + 1,
        // };
        break;

      /* CASE 2: A=true, B=true, C=false */
      case A && B && !C:
        message = "Both tasks without profit card";
        // No profit card, return all products then add both tasks to totalTask and assong a 0 to both task

        products = await getProducts();
        updates = {
          totalTask: (user.todayTask ?? 0) + (user.leftTask ?? 0),
          todayTask: 0,
          leftTask: 0,
        };
        break;

      /* CASE 3: A=true, B=false, C=true */
      case A && !B && C:
        message = "Today task with profit card";
        products = await getProducts(profitValue);
        updates = {
          todayTask: Math.max(user.todayTask - profitValue, 0),
          totalTask: user.totalTask + Math.min(user.todayTask, profitValue),
          // leftTask: user.leftTask - 1,
        };
        break;

      /* CASE 4: A=true, B=false, C=false */
      case A && !B && !C:
        message = "Only today task available";
        products = await getProducts();
        updates = {
          todayTask: 0,
          totalTask: user.totalTask + user.todayTask,
        };
        break;

      /* CASE 5: A=false, B=true, C=true */
      case !A && B && C:
        message = "Left task with profit card";
        products = await getProducts(profitValue);
        updates = {
          leftTask: Math.max(user.leftTask - 1, 0),
          totalTask: user.totalTask + profitValue,
        };
        break;

      /* CASE 6: A=false, B=true, C=false */
      case !A && B && !C:
        message = "Only left task available";
        products = await getProducts();
        updates = {
          leftTask: 0,
          totalTask: user.totalTask + user.leftTask,
        };
        break;

      /* CASE 7: A=false, B=false, C=true */
      case !A && !B && C:
        message = "Only profit card available";
        // No task updates, just return profit data
        break;

      /* CASE 8: A=false, B=false, C=false */
      case !A && !B && !C:
        message = "No tasks or profit card";
        updates = {
          todayTask: user.totalTask, // Reset logic as per requirement
        };
        break;

      default:
        throw new Error("Invalid case combination");
    }

    // 5. Apply Updates
    if (Object.keys(updates).length > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: updates,
      });
    }

    return {
      success: true,
      message,
      products,
      profitCard: C ? profitCard : null,
      ...(Object.keys(updates).length > 0 && { updates }),
    };
  } catch (error) {
    console.error("Error in makeTrick:", error);
    return {
      success: false,
      message: "Operation failed",
      products: [],
    };
  }
}

// Product Fetcher Helper
async function getProducts(limit?: number) {
  return await prisma.product.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}
