"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { contactSchema } from "@/lib/zodSchema";

export async function getContact(
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
  const whereClause: any = {
    status: "PENDING",
  };
  if (searchTerm) {
    whereClause.username = { contains: searchTerm };
  }

  const totalRecords = await prisma.contact.count({
    where: whereClause,
  });

  const contacts = await prisma.contact.findMany({
    where: whereClause,
    skip: skip,
    take: take,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      phone: true,
      status: true,
      userId: true,
      description: true,
      createdAt: true,
    },
  });

  const data = contacts.map((contact) => ({
    ...contact,
    phone: contact.phone.toString(),
    createdAt: contact.createdAt.toISOString(),
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

export async function approveContact(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const contact = await prisma.contact.update({
    where: { id },
    data: { status: "APPROVED" },
  });

  return { message: "Contact approved successfully" };
}
export async function rejectContact(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const contact = await prisma.contact.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  return { message: "Contact rejected successfully" };
}
