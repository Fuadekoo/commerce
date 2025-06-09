import { PrismaClient, Role, Status } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create users
  const adminPassword = await bcryptjs.hash("admin123", 10);
  const userPassword = await bcryptjs.hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      username: "admin",
      phone: "1000000000",
      email: "admin@example.com",
      role: "ADMIN",
      myCode: "ADM001",
      invitationCode: "INVADMIN",
      password: adminPassword,
      transactionPassword: adminPassword,
      balance: 1000,
    },
  });

  const user = await prisma.user.create({
    data: {
      username: "john",
      phone: "2000000000",
      email: "john@example.com",
      role: "USER",
      myCode: "USR001",
      invitationCode: "INVUSER",
      password: userPassword,
      transactionPassword: userPassword,
      balance: 500,
    },
  });

  // Create company account
  await prisma.campanyAccount.create({
    data: {
      name: "Main Company",
      account: "COMP-001",
    },
  });

  // Create products
  const product1 = await prisma.product.create({
    data: {
      name: "Product A",
      description: "First product",
      price: 99.99,
      stock: 10,
      image: "/product-a.png",
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Product B",
      description: "Second product",
      price: 49.99,
      stock: 20,
      image: "/product-b.png",
    },
  });

  // Create orders
  await prisma.order.create({
    data: {
      quantity: 2,
      total: 199.98,
      userId: user.id,
      productId: product1.id,
    },
  });

  // Create recharge record
  await prisma.rechargeRecord.create({
    data: {
      amount: 100,
      status: "APPROVED",
      userId: user.id,
    },
  });

  // Create withdrewal record
  await prisma.withdrewalRecord.create({
    data: {
      amount: 50,
      status: "PENDING",
      userId: user.id,
    },
  });

  // Create withdrewal account
  await prisma.withdrewalAccount.create({
    data: {
      name: "John's Bank",
      account: "BANK-123",
      userId: user.id,
    },
  });

  // Create a post
  await prisma.post.create({
    data: {
      message: "Welcome to the platform!",
    },
  });

  console.log("Seed data created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
