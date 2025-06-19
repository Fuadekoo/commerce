"use server";
import prisma from "@/lib/db";

export async function getAdminList(search?: string) {
  const where: any = { isAdmin: true };
  if (search) {
    where.OR = [{ username: { contains: search } }];
  }
  const admins = await prisma.user.findMany({
    where,
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      socket: true,
      createdAt: true,
    },
  });
  return admins;
}

export async function getChatToAdmin(Username: string) {
  const mydata = await prisma.user.findFirst({
    where: { username: Username },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      socket: true,
      createdAt: true,
    },
  });
  const userBId = mydata?.id;
  const adminUser = await prisma.user.findFirst({
    where: { isAdmin: true },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      socket: true,
      createdAt: true,
    },
  });

  const userAId = adminUser?.id;

  const chat = await prisma.chat.findMany({
    where: {
      OR: [
        { fromUserId: userAId, toUserId: userBId },
        { fromUserId: userBId, toUserId: userAId },
      ],
      // msg:{}
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      msg: true,
      fromUserId: true,
      toUserId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  // when my userBId is found in fromuserid then add a self and true and false the other using a map
  const chats = chat.map((c) => ({
    ...c,
    self: c.fromUserId === userBId,
  }));
  return chats;
}
