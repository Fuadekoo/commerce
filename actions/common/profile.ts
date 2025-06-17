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

  return user;
}

export async function profileUpdate(data: z.infer<typeof updateProfileSchema>) {
  const parsed = updateProfileSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid data");
  }
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  // Only update allowed fields, including phone
  const { name, email, phone } = parsed.data;

  const updateUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone && { phone }),
    },
  });

  return {
    message: "Profile updated successfully",
    user: updateUser,
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
