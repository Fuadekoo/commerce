"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function dashboard() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
    select: {
      // id: true,
      // phone: true,
      myCode: true,
      balance: true,
      todayTask: true,
      totalTask: true,
      leftTask: true,
      // invitationCode: true,
    },
  });

  const totalInvited = await prisma.user.count({
    where: {
      invitationCode: user?.myCode,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Convert Decimal 'balance' to number
  const userWithNumberBalance = {
    ...user,
    balance: Number(user.balance),
  };

  return { user: userWithNumberBalance, totalInvited };
}
