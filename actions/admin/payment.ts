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

  // Build where clause for search
  const where = search
    ? {
        OR: [
          { user: { username: { contains: search, mode: "insensitive" } } },
          { user: { email: { contains: search, mode: "insensitive" } } },
          { user: { phone: { contains: search, mode: "insensitive" } } },
        ],
      }
    : {};

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
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const totalPages = Math.ceil(totalRows / pageSize);

  // Convert Decimal fields to string or number
  const data = allPayment.map((item) => ({
    // Renamed rows to data
    ...item,
    id: item.id, // Ensure id is included if selected
    amount: item.amount ? Number(item.amount) : 0, // Convert to Number, handle null/undefined
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
