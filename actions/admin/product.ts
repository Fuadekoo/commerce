"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { productSchema } from "@/lib/zodSchema";

export async function getProduct(
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

  const whereClause: any = {};
  if (searchTerm) {
    whereClause.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  const totalRecords = await prisma.product.count({
    where: whereClause,
  });

  const productsFromDb = await prisma.product.findMany({
    where: whereClause,
    skip: skip,
    take: take,
    orderBy: { orderNumber: "asc" },
    // You can add a select clause here if you only want specific fields
    // select: {
    //   id: true,
    //   name: true,
    //   description: true,
    //   price: true,
    //   stock: true,
    //   orderNumber: true,
    //   image: true,
    //   createdAt: true,
    //   updatedAt: true,
    // }
  });

  // Assuming your Product model has createdAt and price (as Decimal)
  // Adjust transformations based on your actual Prisma model schema
  const data = productsFromDb.map((product) => ({
    ...product,
    price: Number(product.price), // Convert Decimal to number
    // Convert Date fields to ISO strings if they exist and are needed as strings
    // createdAt: product.createdAt.toISOString(),
    // updatedAt: product.updatedAt.toISOString(),
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

export async function createProduct(data: z.infer<typeof productSchema>) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid product data");
  }

  // Check if orderNumber exists in the input data
  if (
    parsed.data.orderNumber !== undefined &&
    parsed.data.orderNumber !== null
  ) {
    const existingProduct = await prisma.product.findUnique({
      where: { orderNumber: parsed.data.orderNumber },
      select: { id: true },
    });
    if (existingProduct) {
      throw new Error(
        `Product already exists with orderNumber ${parsed.data.orderNumber}`
      );
    }
  }

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
    },
  });

  return { message: "Product created successfully", product };
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const product = await prisma.product.delete({
    where: { id },
  });

  return { message: "Product deleted successfully" };
}
export async function updateProduct(
  id: string,
  data: z.infer<typeof productSchema>
) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid product data");
  }

  const product = await prisma.product.update({
    where: { id },
    data: parsed.data,
  });

  return { message: "product update successfully" };
}

// export async function aproveOrder(id: string) {
//   const session = await auth();
//   if (!session || !session.user || !session.user.id) {
//     throw new Error("Unauthorized");
//   }

//   const order = await prisma.order.update({
//     where: { id },
//     data: { status: "approved" },
//   });

//   return order;
// }
