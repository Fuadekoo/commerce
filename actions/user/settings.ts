"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import * as bcrypt from "bcryptjs";

export async function changePassword(oldPassword: string, newPassword: string) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      return { error: "User not found." };
    }

    if (!user.password) {
      return { error: "Password not set for this user." };
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return { error: "Incorrect old password." };
    }

    if (newPassword.length < 6) {
      // Example: Enforce minimum password length
      return { error: "New password must be at least 6 characters long." };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword },
    });

    return { message: "Password updated successfully." };
  } catch (error) {
    console.error("Error changing password:", error);
    return { error: "Failed to update password. Please try again." };
  }
}

export async function changeTransactionPassword(
  oldPassword: string,
  newPassword: string
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        transactionPassword: true,
      },
    });

    if (!user) {
      return { error: "User not found." };
    }

    // If transaction password can be initially null and set later,
    // this logic might need adjustment. Assuming here it's being changed.
    if (!user.transactionPassword) {
      // If allowing to set for the first time and oldPassword is empty
      if (oldPassword === "" || oldPassword === null) {
        // This means user is setting it for the first time
      } else {
        return {
          error: "Transaction password not set. Cannot verify old password.",
        };
      }
    } else {
      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.transactionPassword
      );
      if (!isOldPasswordValid) {
        return { error: "Incorrect old transaction password." };
      }
    }

    if (newPassword.length < 6) {
      // Example: Enforce minimum password length
      return {
        error: "New transaction password must be at least 6 characters long.",
      };
    }

    const hashedNewTransactionPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { transactionPassword: hashedNewTransactionPassword },
    });

    return { message: "Transaction password updated successfully." };
  } catch (error) {
    console.error("Error changing transaction password:", error);
    return {
      error: "Failed to update transaction password. Please try again.",
    };
  }
}
