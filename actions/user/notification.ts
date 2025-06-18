"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
export async function getNotification() {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const notifications = await prisma.message.findMany({
    where: {
      // createdAt: {
      //   gte: todayStart,
      // },
      OR: [{ userId: session.user.id }, { userId: null }],
    },
    orderBy: { createdAt: "desc" },
  });

  // AFTER FETCH — SET ALL UNREAD AS READ
  await prisma.message.updateMany({
    where: {
      isRead: false,
      createdAt: {
        gte: todayStart,
      },
      OR: [{ userId: session.user.id }, { userId: null }],
    },
    data: {
      isRead: true,
    },
  });

  return notifications;
}
