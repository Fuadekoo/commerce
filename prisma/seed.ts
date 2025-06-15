import { PrismaClient, Role, Status } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create users
  const adminPassword = await bcryptjs.hash("admin123", 10);
  const userPassword = await bcryptjs.hash("user1234", 10);

  const admin = await prisma.user.create({
    data: {
      username: "admin",
      phone: "1000000000",
      email: "admin@example.com",
      role: "ADMIN", // Role enum is used directly
      myCode: "ADM001",
      invitationCode: "INVADMIN",
      password: adminPassword,
      transactionPassword: adminPassword,
      balance: 1000,
      // photo, walletAddress, remarks are optional
      // isBlocked, todayTask, totalTask, leftTask will use default values
    },
  });

  const user = await prisma.user.create({
    data: {
      username: "john",
      phone: "2000000000",
      email: "john@example.com",
      role: "USER", // Role enum is used directly
      myCode: "USR001",
      invitationCode: "INVUSER",
      password: userPassword,
      transactionPassword: userPassword,
      balance: 500,
      // photo, walletAddress, remarks are optional
      // isBlocked, todayTask, totalTask, leftTask will use default values
    },
  });

  // Create company account
  await prisma.campanyAccount.create({
    data: {
      name: "Main Company",
      account: "COMP-001",
      // Removed database field
    },
  });

  // Create 60 products with real product names and orderNumber from 1 to 60
  const productNames = [
    "Shampoo",
    "Soap",
    "Detergent",
    "Clothes",
    "Trousers",
    "Toothpaste",
    "Toothbrush",
    "Face Wash",
    "Body Lotion",
    "Hand Sanitizer",
    "Conditioner",
    "Hair Oil",
    "Face Cream",
    "Shaving Cream",
    "Deodorant",
    "Perfume",
    "Lip Balm",
    "Sunscreen",
    "Face Mask",
    "Hand Wash",
    "Dish Soap",
    "Laundry Powder",
    "Floor Cleaner",
    "Glass Cleaner",
    "Mop",
    "Bucket",
    "Towel",
    "Bedsheet",
    "Pillow",
    "Blanket",
    "Jacket",
    "Shirt",
    "Skirt",
    "Dress",
    "Shorts",
    "Socks",
    "Shoes",
    "Sandals",
    "Slippers",
    "Cap",
    "Belt",
    "Wallet",
    "Bag",
    "Backpack",
    "Watch",
    "Sunglasses",
    "Scarf",
    "Gloves",
    "Sweater",
    "Coat",
    "Jeans",
    "Blazer",
    "Tie",
    "Suit",
    "Undergarments",
    "Bra",
    "Panties",
    "Boxers",
    "Vest",
    "Raincoat",
  ];

  for (let i = 0; i < 60; i++) {
    await prisma.product.create({
      data: {
        name: productNames[i],
        price: 10 + i * 2, // Example price
        stock: 10 + i, // Example stock
        orderNumber: i + 1,
      },
    });
  }

  // Create recharge record
  await prisma.rechargeRecord.create({
    data: {
      amount: 100,
      status: "APPROVED", // Status enum is used directly
      userId: user.id,
      photo: "path/to/recharge_proof.jpg", // Added photo field
    },
  });

  // Create withdrewal record
  await prisma.withdrewalRecord.create({
    data: {
      amount: 50,
      status: "PENDING", // Status enum is used directly
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

  // Create a message
  await prisma.message.create({
    data: {
      content: "This is a system message.",
    },
  });

  // Create a profit card
  await prisma.profitCard.create({
    data: {
      orderNumber: 101,
      profit: 10,
      priceDifference: 5,
      status: "PENDING", // Status enum is used directly
      userId: user.id,
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
