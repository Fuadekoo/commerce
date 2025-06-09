"use server";
import prisma from "@/lib/db";

interface GetPaymentOptions {
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function getPayment(options: GetPaymentOptions = {}) {
  const { search = "", page = 1, pageSize = 50 } = options;

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
    include: {
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
  const rows = allPayment.map((item) => ({
    ...item,
    amount: item.amount?.toString(), // or Number(item.amount)
    createdAt: item.createdAt.toISOString(),
  }));

  return {
    rows,
    totalRows,
    totalPages,
    currentPage: page,
    pageSize,
  };
}
