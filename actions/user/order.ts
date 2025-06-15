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

  // Check if the user has a profit card
  const profitCard = await prisma.profitCard.findFirst({
    where: { userId: session.user.id },
    orderBy: { orderNumber: "asc" },
  });

  if (profitCard) {
    // If profit card exists, return it.fristly return a product until the profitcard.ordernumber==product.ordernumber then return profit card data
    // then we edit the user table .reduce the final gate ordernumber from todaytask. and  and set the reft in today task and left task and add the ordernumber in total task.
    const products = await prisma.product.findMany({
      where: { orderNumber: { lte: profitCard.orderNumber } },
      orderBy: { orderNumber: "asc" },
    });
    // Update user's task counts
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        todayTask: { decrement: profitCard.orderNumber }, // Decrement today's task
        totalTask: { increment: profitCard.orderNumber }, // Increment total tasks
        leftTask: { decrement: 1 }, // Decrement left tasks
      },
    });

    return { message: "Profit card found", products, profitCard };
  } else {
    // If no profit card, return all products ordered by orderNumber
    
    const products = await prisma.product.findMany({
      orderBy: { orderNumber: "asc" },
    });
    // Update user's task counts
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        todayTask: { decrement: 60 }, // Decrement today's task
        totalTask: { increment: 60 }, // Increment total tasks
        leftTask: { decrement: 0 }, // Decrement left tasks
      },
    });

    return {
      message: "No profit card found, returning all products",
      products,
    };
  }
}
