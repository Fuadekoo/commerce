"use server";
import prisma from "@/lib/db";
// import { loginData } from "@/actions/common/authentication";
import { depositSchema, withdrawSchema } from "@/lib/zodSchema";
import { z } from "zod";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function deposit(data: z.infer<typeof depositSchema>) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;
  const parsed = depositSchema.safeParse(data);
  if (!parsed.success) {
    return { message: "Validation failed" };
  }
  if (parsed.data.amount <= 0) {
    return { message: "Amount must be greater than 0" };
  }
  if (!parsed.data.photo) {
    return { message: "Photo is required" };
  }

  // Use a transaction to update balance and create deposit record atomically
  await prisma.$transaction([
    prisma.rechargeRecord.create({
      data: {
        userId,
        amount: parsed.data.amount,
        photo: parsed.data.photo,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        balance: {
          increment: parsed.data.amount,
        },
      },
    }),
  ]);

  return { message: "Deposit successful" };
}

export async function DepositHistory() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  // Fetch deposit history for the user
  const history = await prisma.rechargeRecord.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      amount: true,
      photo: true,
      createdAt: true,
      // updatedAt: true,
    },
  });

  return history;
}

export async function withdraw(data: {
  amount: number;
  transactionPassword: string;
}) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  // Validate amount
  if (typeof data.amount !== "number" || data.amount <= 0) {
    return { message: "Amount must be greater than 0" };
  }
  if (!data.transactionPassword) {
    return { message: "Transaction password is required" };
  }

  // Fetch user and check balance and transaction password
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { message: "User not found" };
  }
  if (Number(user.balance) < data.amount) {
    return { message: "Insufficient balance" };
  }
  if (!user.transactionPassword) {
    return { message: "No transaction password set" };
  }

  // Validate transaction password
  const isPasswordValid = await bcrypt.compare(
    data.transactionPassword,
    user.transactionPassword
  );
  if (!isPasswordValid) {
    return { message: "Invalid transaction password" };
  }

  // Use a transaction to create withdrawal record and decrement balance atomically
  await prisma.$transaction([
    prisma.withdrewalRecord.create({
      data: {
        userId,
        amount: data.amount,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        balance: {
          decrement: data.amount,
        },
      },
    }),
  ]);

  return { message: "Withdrawal successful" };
}
export async function WithdrawalHistory() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  // Fetch withdrawal history for the user
  const history = await prisma.withdrewalRecord.findMany({
    where: { userId },
    select: {
      id: true,
      amount: true,
      createdAt: true,
      //   updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return history;
}
