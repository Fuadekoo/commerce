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
  const whereClause: any = {
    role: "USER", // Assuming you want to filter by user role
    // isBlocked: false, // Assuming you want to exclude blocked users
  };
  if (searchTerm) {
    whereClause.username = { contains: searchTerm, mode: "insensitive" };
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
      todayTask: true,
      totalTask: true,
      leftTask: true,
      remarks: true,
      phone: true,
      invitationCode: true,
      myCode: true,
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

export async function addRemarksUser(id: string, remarks: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  // Optionally, check if the user is an admin here

  const user = await prisma.user.update({
    where: { id },
    data: { remarks },
  });

  return {
    message: "Remarks added successfully",
    user,
  };
}
export async function addprofitCard(
  orderNumber: number,
  profit: number,
  priceDifference: number,
  userId: string
) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  // Optionally, check if the user is an admin here

  const profitCard = await prisma.profitCard.create({
    data: {
      orderNumber,
      profit,
      priceDifference,
      user: {
        connect: { id: userId },
      },
    },
  });

  return {
    message: "Profit card added successfully",
    profitCard,
  };
}

export async function setTask(id: string, order: number) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const task = await prisma.user.update({
    where: { id },
    data: { todayTask: order },
  });

  return {
    message: "Task Added successfully",
    todayTask: task.todayTask,
  };
}

export async function resetPassword(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  // Optionally, check if the user is an admin here

  // gate the user mycode
  const userCode = await prisma.user.findUnique({
    where: { id },
    select: { myCode: true },
  });

  const user = await prisma.user.update({
    where: { id },
    data: { password: userCode?.myCode }, // Set a new password
  });

  return {
    message: "Password reset successfully",
  };
}

export async function resetTransactionPassword(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  // Optionally, check if the user is an admin here

  // gate the user mycode
  const userCode = await prisma.user.findUnique({
    where: { id },
    select: { myCode: true },
  });

  const user = await prisma.user.update({
    where: { id },
    data: { transactionPassword: userCode?.myCode }, // Set a new transaction password
  });

  return {
    message: "Transaction password reset successfully",
  };
}

// export async function resetAllPassword() {
//   const session = await auth();
//   if (!session || !session.user || !session.user.id) {
//     throw new Error("Unauthorized");
//   }

//   // Optionally, check if the user is an admin here

//   const users = await prisma.user.findMany({
//     where: { role: "USER" }, // Assuming you want to reset passwords for all users
//     select: { id: true, myCode: true },
//   });

//   const updatedUsers = await Promise.all(
//     users.map((user) =>
//       prisma.user.update({
//         where: { id: user.id },
//         data: { password: user.myCode }, // Set a new password
//       })
//     )
//   );

//   return {
//     message: "All user passwords reset successfully",
//     users: updatedUsers,
//   };
// }
