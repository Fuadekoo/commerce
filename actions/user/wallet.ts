"use server";
import prisma from "@/lib/db";
// import { loginData } from "@/actions/common/authentication";
import { depositSchema, withdrawSchema } from "@/lib/zodSchema";
import { string, z } from "zod";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";

export async function deposits(data: z.infer<typeof depositSchema>) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  // Validate input
  if (!data.amount || data.amount <= 0) {
    return { message: "Amount must be greater than 0" };
  }
  if (!data.photo) {
    return { message: "Photo is required" };
  }

  // Assume data.photo is a base64 string or a Buffer
  // Generate unique filename
  const ext = ".jpg"; // or parse from data.photo if you have mime info
  const uniqueName = `${randomUUID()}${ext}`;
  const filePath = path.join(process.cwd(), "filedata", uniqueName);

  // Save file
  let buffer: Buffer;
  if (typeof data.photo === "string" && data.photo.startsWith("data:")) {
    // base64 data URL
    const base64 = data.photo.split(",")[1];
    buffer = Buffer.from(base64, "base64");
  } else if (typeof data.photo === "string") {
    buffer = Buffer.from(data.photo, "base64");
  } else {
    buffer = data.photo;
  }
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, buffer);

  // Save deposit record
  await prisma.rechargeRecord.create({
    data: {
      userId,
      amount: data.amount,
      photo: uniqueName,
    },
  });

  // Update user balance
  // await prisma.user.update({
  //   where: { id: userId },
  //   data: {
  //     balance: {
  //       increment: data.amount,
  //     },
  //   },
  // });

  return { message: "Deposit successful" };
}

export async function aproofDeposit(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  // Fetch the deposit record
  const depositRecord = await prisma.rechargeRecord.findUnique({
    where: { id },
    select: {
      id: true,
      amount: true,
      photo: true,
      userId: true,
      createdAt: true,
    },
  });
  if (!depositRecord) {
    return { message: "Deposit record not found" };
  }

  // Update user balance
  await prisma.user.update({
    where: { id: depositRecord.userId },
    data: {
      balance: {
        increment: depositRecord.amount,
      },
    },
  });

  return { message: "Deposit approved successfully" };
}

//     throw new Error("Unauthorized");
//   }
//   const userId = session.user.id;
//   const parsed = depositSchema.safeParse(data);
//   if (!parsed.success) {
//     return { message: "Validation failed" };
//   }
//   if (parsed.data.amount <= 0) {
//     return { message: "Amount must be greater than 0" };
//   }
//   if (!parsed.data.photo) {
//     return { message: "Photo is required" };
//   }

//   // Use a transaction to update balance and create deposit record atomically
//   await prisma.$transaction([
//     prisma.rechargeRecord.create({
//       data: {
//         userId,
//         amount: parsed.data.amount,
//         photo: parsed.data.photo,
//       },
//     }),
//     prisma.user.update({
//       where: { id: userId },
//       data: {
//         balance: {
//           increment: parsed.data.amount,
//         },
//       },
//     }),
//   ]);

//   return { message: "Deposit successful" };
// }

export async function DepositHistory(
  searchTerm?: string,
  currentPage?: number,
  itemsPerPage?: number
) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  // If searchTerm is provided, reset pagination
  if (searchTerm) {
    currentPage = 1;
    itemsPerPage = 10;
  }

  const page = currentPage && currentPage > 0 ? currentPage : 1;
  const take = itemsPerPage && itemsPerPage > 0 ? itemsPerPage : 10;
  const skip = (page - 1) * take;

  // Build where clause (add search logic if needed)
  const whereClause: any = { userId };
  // Example: if you want to filter by status or amount, add here

  const totalRecords = await prisma.rechargeRecord.count({
    where: whereClause,
  });

  const historyRaw = await prisma.rechargeRecord.findMany({
    where: {
      userId,
    },
    orderBy: { createdAt: "desc" },
    skip: skip,
    take: take,
    select: {
      id: true,
      amount: true, // Decimal
      photo: true,
      status: true,
      createdAt: true,
    },
  });

  // Convert Decimal 'amount' to number and 'createdAt' to string
  const history = historyRaw.map((record) => ({
    ...record,
    amount: Number(record.amount),
    createdAt: record.createdAt.toISOString(),
  }));

  const totalPages = Math.ceil(totalRecords / take);

  return {
    data: history,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      itemsPerPage: take,
      totalRecords: totalRecords,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export async function withdraw(data: {
  amount: number;
  transactionPassword: string;
}) {
  console.log("withdraw data", data);
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
export async function WithdrawalHistorys(
  searchTerm?: string,
  currentPage?: number,
  itemsPerPage?: number
) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  const page = currentPage && currentPage > 0 ? currentPage : 1;
  const take = itemsPerPage && itemsPerPage > 0 ? itemsPerPage : 10;
  const skip = (page - 1) * take;

  // Build where clause (add search logic if needed)
  const whereClause: any = { userId };
  // Example: if you want to filter by status or amount, add here

  const totalRecords = await prisma.rechargeRecord.count({
    where: whereClause,
  });

  //   // Fetch withdrawal history for the user
  const historys = await prisma.withdrewalRecord.findMany({
    where: { userId },
    skip: skip,
    take: take,
    select: {
      id: true,
      amount: true,
      status: true,
      createdAt: true,
      //   updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  //   return history;
  // }
  // Convert Decimal 'amount' to number and 'createdAt' to string
  const history = historys.map((record) => ({
    ...record,
    amount: Number(record.amount),
    createdAt: record.createdAt.toISOString(),
  }));

  const totalPages = Math.ceil(totalRecords / take);

  return {
    data: history,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      itemsPerPage: take,
      totalRecords: totalRecords,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getCompanyAccount() {
  const companyAccounts = await prisma.campanyAccount.findMany({
    select: {
      id: true,
      account: true,
      name: true,
    },
    // orderBy: {
    //   createdAt: "desc",
    // },
  });
  if (companyAccounts.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * companyAccounts.length);
  return companyAccounts[randomIndex];
}
