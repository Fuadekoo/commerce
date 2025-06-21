"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

// interface GetPaymentOptions {
//   search?: string;
//   page?: number;
//   pageSize?: number;
// }

export async function getPayment(
  search?: string,
  page?: number,
  pageSize?: number
) {
  //  if no data is come by default page =1 and pagesize 50
  page = page && page > 0 ? page : 1;
  pageSize = pageSize && pageSize > 0 ? pageSize : 50;
  // if search is provide the paagesize = 10 and page = 1
  if (search) {
    pageSize = 10;
    page = 1;
  }

  // Only search by username
  let where = {};
  if (search) {
    // Find user IDs matching the username search
    const users = await prisma.user.findMany({
      where: {
        username: { contains: search },
      },
      select: { id: true },
    });
    const userIds = users.map((u) => u.id);
    where = { userId: { in: userIds } };
  }

  // Get total count for pagination
  const totalRows = await prisma.rechargeRecord.count({
    where,
  });

  // Get paginated data
  const allPayment = await prisma.rechargeRecord.findMany({
    where,
    select: {
      id: true,
      amount: true,
      photo: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          username: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: [
      {
        status: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const totalPages = Math.ceil(totalRows / pageSize);

  // Convert Decimal fields to string or number
  const data = allPayment.map((item) => ({
    // Renamed rows to data
    ...item,
    id: item.id, // Ensure id is included if selected
    amount: item.amount !== undefined && item.amount !== null ? String(item.amount) : "0", // Convert to string, handle null/undefined
    createdAt: item.createdAt.toISOString(),
  }));

  return {
    data, // Changed from rows to data
    pagination: {
      // Added pagination object
      currentPage: page,
      totalPages: totalPages,
      itemsPerPage: pageSize,
      totalRecords: totalRows,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
export async function aProofDeposit(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  // Fetch the deposit record
  const depositRecord = await prisma.rechargeRecord.findUnique({
    where: { id },
    select: {
      id: true,
      amount: true,
      photo: true,
      userId: true,
      createdAt: true,
      status: true,
    },
  });
  if (!depositRecord) {
    return { message: "Deposit record not found" };
  }
  if (depositRecord.status === "APPROVED") {
    return { message: "Deposit already approved" };
  }

  // Use a transaction to update both user balance and deposit status
  await prisma.$transaction([
    prisma.user.update({
      where: { id: depositRecord.userId },
      data: {
        balance: {
          increment: Number(depositRecord.amount),
        },
      },
    }),
    prisma.rechargeRecord.update({
      where: { id: depositRecord.id },
      data: {
        status: "APPROVED",
      },
    }),
  ]);

  return { message: "Deposit approved successfully" };
}

export async function rejectDeposit(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  // Fetch the deposit record
  const depositRecord = await prisma.rechargeRecord.findUnique({
    where: { id },
    select: {
      id: true,
      amount: true,
      photo: true,
      userId: true,
      createdAt: true,
      status: true,
    },
  });
  if (!depositRecord) {
    return { message: "Deposit record not found" };
  }
  if (depositRecord.status === "REJECTED") {
    return { message: "Deposit already rejected" };
  }

  // Update the deposit status to REJECTED
  await prisma.rechargeRecord.update({
    where: { id: depositRecord.id },
    data: {
      status: "REJECTED",
    },
  });

  return { message: "Deposit rejected successfully" };
}
