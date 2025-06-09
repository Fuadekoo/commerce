"use server";
import prisma from "@/lib/db";
import { signupSchema } from "@/lib/zodSchema";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid"; // Add this impo

export async function newUser(data: z.infer<typeof signupSchema>) {
  try {
    const parsed = signupSchema.safeParse(data);
    if (!parsed.success) {
      return {
        message: "Validation failed",
      };
    }

    //   check the password and confirm password is similar
    if (parsed.data.password !== parsed.data.confirmPassword) {
      return { message: "Password and confirm password do not match" };
    }

    // Generate myCode
    const myCode = uuidv4().replace(/-/g, "").substring(0, 7);

    await prisma.user.create({
      data: {
        username: parsed.data.username,
        email: parsed.data.email,
        password: parsed.data.password,
        phone: parsed.data.phone,
        invitationCode: parsed.data.invitationCode ?? "", // Provide a default or get from data
        transactionPassword: parsed.data.transactionPassword ?? "", // Provide a default or get from data
        myCode,
      },
    });
    return { message: "User created successfully" };
  } catch (error) {
    console.error(error);
    return {
      message: "Error creating user",
      //   error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
