"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function getLoginUserId(){
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Unauthorized");
    }
    return session.user.id; 
}
export async function getUserByUsername(username: string) {
  const user = await prisma.user.findFirst({
    where: { username },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      socket: true,
      createdAt: true,
    },
  });
  return user;
}
export async function getUserChat(userAId: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const mydata = await prisma.user.findFirst({
    where: { id: session.user.id },
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


export async function getUserList(search?: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const loginuser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      username: true,
      phone: true,
      socket: true,
      createdAt: true,
    },
  });
  const loginuserId = loginuser?.id;

  const userList = await prisma.user.findMany({
    where: {
      id: {
        not: loginuserId,
      },
      ...(search
        ? {
            OR: [{ name: { contains: search } }],
          }
        : {}),
      // only users with  atleast one chat to or from the current user
      OR: [
        {
          chatsFrom: {
            some: { toUserId: loginuserId },
          },
        },
        {
          chatsTo: {
            some: { fromUserId: loginuserId },
          },
        },
      ],
    },
    select: {
      id: true,
      username: true,
      phone: true,
      socket: true,
      createdAt: true,
    },
  });
  return userList;
}

// find the user by phone number and chat with it.
export async function FindUser(searchTerm: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const loginuserId = session.user.id;

  const userList = await prisma.user.findFirst({
    where: {
      id: {
        not: loginuserId,
      },
      ...(searchTerm
        ? {
            OR: [{ phone: { contains: searchTerm } }],
          }
        : {}),
    },
    select: {
      id: true,
      username: true,
      phone: true,
    },
  });
  return userList;
}
