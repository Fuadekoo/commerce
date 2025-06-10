"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
export async function invitedata() {
  const session = await auth();
  if (!session || !session.user || !session.user.id)
    throw new Error("Unauthorized");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      myCode: true,
    },
  });

  const invitedUser = await prisma.user.count({
    where: {
      invitationCode: user?.myCode,
    },
  });
  if (!user) throw new Error("User not found");
  return invitedUser;
}
