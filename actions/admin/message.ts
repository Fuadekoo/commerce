"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function postMessage(message: string) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { message: "No user session found" };
    }

    // Create a new message in the database
    const newMessage = await prisma.message.create({
      data: {
        content: message,
      },
    });

    return { message: "Message posted successfully", data: newMessage };
  } catch (error) {
    console.error("Error posting message:", error);
    return { message: "Error posting message" };
  }
}
