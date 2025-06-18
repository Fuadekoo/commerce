"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/zodSchema";
import { z } from "zod";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import fs from "fs/promises";

export async function viewProfile() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      username: true,
      myCode: true,
      email: true,
      phone: true,
      photo: true,
      balance: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Convert Decimal fields to number or string
  return {
    ...user,
    balance: user.balance ? Number(user.balance) : 0,
  };
}

export async function profileUpdate(
  username: string,
  phone: string,
  email: string
) {
  const parsed = updateProfileSchema.safeParse({
    username,
    phone,
  });
  if (!parsed.success) {
    throw new Error("Invalid data");
  }
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  // Only update allowed fields, including phone
  const { name: parsedName, phone: parsedPhone } = parsed.data;

  const updateUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(parsedName && { username: parsedName }),
      ...(parsedPhone && { phone: parsedPhone }),
    },
  });

  return {
    message: "Profile updated successfully",
  };
}
export async function profilePhotoUpdate(file: File) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  if (!file) {
    throw new Error("No file provided");
  }

  // Ensure the directory exists
  const uploadDir = path.join(process.cwd(), "filedata/profile");
  await fs.mkdir(uploadDir, { recursive: true });

  // Generate a unique filename
  const ext = path.extname(file.name) || ".jpg";
  const uniqueName = `${randomUUID()}${ext}`;
  const filepath = path.join(uploadDir, uniqueName);

  // Read file buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Save file
  await fs.writeFile(filepath, buffer);

  // Update user profile photo path in DB
  const photoUrl = uniqueName;
  await prisma.user.update({
    where: { id: session.user.id },
    data: { photo: photoUrl },
  });

  return {
    message: "Profile photo updated successfully",
  };
}

export async function mydata() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      photo: true,
      balance: true,
      walletAddress: true,
      myCode: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // total invited user by this user mycode
  const totalInvitedUsers = await prisma.user.count({
    where: {
      invitationCode: user?.myCode,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    totalInvitedUsers,
    walletAddress: user.walletAddress,
    balance: user.balance ? Number(user.balance) : 0,
  };
}
export async function myAccount() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      walletAddress: true,
      balance: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    ...user,
    balance: user.balance ? Number(user.balance) : 0,
  };
}

export async function setMyAccount(walletAddress: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      walletAddress,
    },
  });

  return {
    message: "Wallet address updated successfully",
  };
}
