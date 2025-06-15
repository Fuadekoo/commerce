"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
export async function adminDashboard() {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized access");
  }

  const totalUsers = await prisma.user.count({
    where: {
      role: "USER",
    },
  });
  const totalUserBalance = await prisma.user.aggregate({
    _sum: {
      balance: true,
    },
  });
  const products = await prisma.product.count();
  const TopBalanceUsers = await prisma.user.findMany({
    orderBy: {
      balance: "desc",
    },
    take: 1,
    select: {
      balance: true,
    },
  });

  const totalProfitCard = await prisma.profitCard.count({
    where: {
      status: "PENDING",
    },
  });

  return {
    totalUsers,
    totalUserBalance,
    products,
    TopBalanceUsers,
    totalProfitCard,
  };
}
