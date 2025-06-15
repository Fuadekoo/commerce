"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function changePassword(newPassword: string) {
  const session = await auth();
  if (!session || !session.user) throw new Error("Unauthorized");

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { password: newPassword },
  });
  return { message: "Password updated successfully" };
}

export async function changeTransactionPassword(newPassword: string) {
  const session = await auth();
  if (!session || !session.user) throw new Error("Unauthorized");

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { transactionPassword: newPassword },
  });
  return { message: "Transaction password updated successfully" };
}

// this is a admin work when user is lost it transanction password admin can reset it
export async function resetTransactionPassword(userId: string) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  // Generate a new transaction password (for example, a random string)
  const newTransactionPassword = Math.random().toString(36).slice(-8);

  // Update the user's transaction password
  await prisma.user.update({
    where: { id: userId },
    data: { transactionPassword: newTransactionPassword },
  });

  return {
    message: "Transaction password reset successfully",
    newTransactionPassword,
  };
}
