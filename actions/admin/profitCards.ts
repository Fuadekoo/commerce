"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function getProfitCards(
  searchTerm?: string,
  currentPage?: number,
  itemsPerPage?: number
) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const page = currentPage && currentPage > 0 ? currentPage : 1;
  const take = itemsPerPage && itemsPerPage > 0 ? itemsPerPage : 10;
  const skip = (page - 1) * take;

  // Build where clause for search
  const whereClause: any = {};
  if (searchTerm) {
    whereClause.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  const totalRecords = await prisma.profitCard.count({
    where: whereClause,
  });

  const profitCardsFromDb = await prisma.profitCard.findMany({
    where: whereClause,
    select: {
      id: true,
      orderNumber: true,
      profit: true,
      priceDifference: true,
      createdAt: true,
      status: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    skip: skip,
    take: take,
    orderBy: { createdAt: "desc" },
  });

  const data = profitCardsFromDb.map((card) => ({
    ...card,
  }));

  const totalPages = Math.ceil(totalRecords / take);

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      itemsPerPage: take,
      totalRecords,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export async function addProfit(data: {
  orderNumber: string;
  profit: number;
  priceDifference: number;
  status: string;
  userId: string;
  description?: string;
  name?: string;
}) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const profitCard = await prisma.profitCard.create({
    data: {
      orderNumber: Number(data.orderNumber),
      profit: data.profit,
      priceDifference: data.priceDifference,
      userId: data.userId,
    },
  });

  return { message: "Profit card created successfully" };
}

export async function deleteProfit(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.profitCard.delete({
    where: { id },
  });

  return { message: "Profit card deleted successfully" };
}

export async function approveProfit(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const profitCard = await prisma.profitCard.update({
    where: { id },
    data: { status: "APPROVED" },
  });

  return { message: "profit approved successfully" };
}
