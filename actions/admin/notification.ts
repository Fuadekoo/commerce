"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function createNotification(message: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const newNotification = await prisma.message.create({
    data: {
      content: message,
    },
  });

  return {
    message: "Notification created successfully",
  };
}
export async function getNotifications() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const notifications = await prisma.message.findMany({
    where: { userId: null },
    orderBy: { createdAt: "desc" },
  });

  return notifications;
}

export async function deleteNotification(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const notification = await prisma.message.delete({
    where: { id },
  });

  return { message: "Notification deleted successfully" };
}

export async function updateNotification(id: string, content: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const notification = await prisma.message.update({
    where: { id },
    data: { content },
  });

  return { message: "Notification updated successfully" };
}
