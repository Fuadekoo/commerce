"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function getUser(
  searchTerm?: string,
  currentPage?: number,
  itemsPerPage?: number
) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  // Optionally, check if the user is an admin here

  const page = currentPage && currentPage > 0 ? currentPage : 1;
  const take = itemsPerPage && itemsPerPage > 0 ? itemsPerPage : 10;
  const skip = (page - 1) * take;

  // Build where clause for search
  const whereClause: any = {};
  if (searchTerm) {
    whereClause.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  const totalRecords = await prisma.user.count({
    where: whereClause,
  });

  const users = await prisma.user.findMany({
    where: whereClause,
    skip: skip,
    take: take,
    select: {
      id: true,
      username: true,
      email: true,
      balance: true, // Decimal
      phone: true,
      invitationCode: true,
      isBlocked: true,
      createdAt: true,
      // add more fields as needed
    },
    orderBy: { createdAt: "desc" },
  });

  const data = users.map((user) => ({
    ...user,
    balance: Number(user.balance), // Convert Decimal to number
    createdAt: user.createdAt.toISOString(),
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

export async function getUserById(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  // Optionally, check if the user is an admin here

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      balance: true, // Decimal
      phone: true,
      invitationCode: true,
      isBlocked: true,
      createdAt: true,
      // add more fields as needed
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function blockUser(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  // Optionally, check if the user is an admin here

  const user = await prisma.user.update({
    where: { id },
    data: { isBlocked: true },
  });

  return {
    message: "User blocked successfully",
  };
}

export async function unblockUser(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  // Optionally, check if the user is an admin here

  const user = await prisma.user.update({
    where: { id },
    data: { isBlocked: false },
  });

  return {
    message: "User unblocked successfully",
  };
}
