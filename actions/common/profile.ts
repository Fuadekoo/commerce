"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/zodSchema";
import { z } from "zod";

export async function profileUpdate(data: z.infer<typeof updateProfileSchema>) {
  const parsed = updateProfileSchema.safeParse(data);
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  // Logic for updating the profile
  // This could include updating user details like name, email, etc.
  const updateUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...parsed.data,
    },
  });

  return {
    message: "Profile updated successfully",
    user: updateUser,
  };
}

export async function profilePhotoUpdate() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  // Logic for updating the profile photo
}
