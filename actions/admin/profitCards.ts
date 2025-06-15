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

  const profitCards = await prisma.profitCard.findMany({
    where: whereClause,
    skip: skip,
    take: take,
    orderBy: { createdAt: "desc" },
  });

  return {
    profitCards,
    totalRecords,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / take),
  };
}
