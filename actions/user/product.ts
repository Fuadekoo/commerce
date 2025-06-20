"use server";
import prisma from "@/lib/db";

export async function getAllProductdata() {
  try {
    const products = await prisma.product.findMany();
    return products;
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getProductById(id: string) {}

export async function filterProduct() {}

export async function getProductStats() {
    try {
        const [total, priceSum, stockSum] = await Promise.all([
            prisma.product.count(),
            prisma.product.aggregate({ _sum: { price: true } }),
            prisma.product.aggregate({ _sum: { stock: true } }),
        ]);
        return {
            totalProducts: total,
            totalPrice: Number(priceSum._sum.price ?? 0),
            totalStocks: Number(stockSum._sum.stock ?? 0),
        };
    } catch (error) {
        console.error("Error fetching product stats:", error);
        throw new Error("Failed to fetch product stats");
    }
}
