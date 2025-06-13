"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { productSchema } from "@/lib/zodSchema";

export async function getProduct() {}

export async function postProduct(data: z.infer<typeof productSchema>) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid product data");
  }

  const product = await prisma.product.create({
    data: parsed.data,
  });

  return product;
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const product = await prisma.product.delete({
    where: { id },
  });

  return product;
}
export async function updateProduct(id: string, data: z.infer<typeof productSchema>) {
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

  return product;
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