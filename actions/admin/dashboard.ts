"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function adminDashboard() {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized access");
  }

  const totalUsers = await prisma.user.count({
    where: { role: "USER" },
  });

  const totalUserBalance = await prisma.user.aggregate({
    _sum: { balance: true },
  });

  const totalProducts = await prisma.product.count();

  const topBalanceUser = await prisma.user.findFirst({
    orderBy: { balance: "desc" },
    take: 1,
    select: { balance: true },
  });

  const pendingProfitCards = await prisma.profitCard.count({
    where: { status: "PENDING" },
  });
  console.log("Pending Profit Cards:", pendingProfitCards); 

  // Convert Decimal to number for client compatibility
  return {
    users: {
      total: totalUsers,
      totalBalance: totalUserBalance._sum.balance
        ? Number(totalUserBalance._sum.balance)
        : 0,
      topBalanceUser: topBalanceUser
        ? { balance: Number(topBalanceUser.balance) }
        : null,
    },
    products: {
      total: totalProducts,
    },
    profitCards: {
      pending: pendingProfitCards,
    },
  };
}
