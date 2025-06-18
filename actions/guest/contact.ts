"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { contactSchema } from "@/lib/zodSchema";

export async function createContact(data: z.infer<typeof contactSchema>) {
  // Validate the input data
  const parsedData = contactSchema.safeParse(data);
  if (!parsedData.success) {
    throw new Error("Invalid input data");
  }

  //   find user id using th euser inter phone number
  const user = await prisma.user.findFirst({
    where: {
      phone: parsedData.data.phone,
    },
  });

  //   if user is not found then return error
  if (!user) {
    return {
      message: "User not found with the provided phone number",
    };
  }

  // Create a new contact entry
  const contact = await prisma.contact.create({
    data: {
      ...parsedData.data,
      phone: Number(parsedData.data.phone),
      userId: user.id, // Associate with user if found
    },
  });

  return { message: "Contact created successfully", contact };
}
