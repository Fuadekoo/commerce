"use server";
import prisma from "@/lib/db";
import { signupSchema } from "@/lib/zodSchema";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function newUser(data: z.infer<typeof signupSchema>) {
  try {
    const parsed = signupSchema.safeParse(data);
    if (!parsed.success) {
      return {
        message: "Validation failed",
      };
    }

    // Check the password and confirm password is similar
    if (parsed.data.password !== parsed.data.confirmPassword) {
      return { message: "Password and confirm password do not match" };
    }

    // Check invitationCode is present in myCode of a user (if provided)
    if (parsed.data.invitationCode) {
      const inviter = await prisma.user.findUnique({
        where: { myCode: parsed.data.invitationCode },
        select: { id: true },
      });
      if (!inviter) {
        console.log("Invalid invitation code:", parsed.data.invitationCode);
        return { message: "Invalid invitation code" };
      }
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
    if (!parsed.data.transactionPassword) {
      return { message: "Transaction password is required" };
    }
    const hashedTransactionPassword = await bcrypt.hash(
      parsed.data.transactionPassword,
      10
    );

    // Generate myCode
    const myCode = uuidv4().replace(/-/g, "").substring(0, 7);

    await prisma.user.create({
      data: {
        username: parsed.data.username,
        email: parsed.data.email,
        password: hashedPassword,
        phone: parsed.data.phone,
        invitationCode: parsed.data.invitationCode ?? "",
        transactionPassword: hashedTransactionPassword,
        myCode,
      },
    });
    return { message: "User created successfully" };
  } catch (error) {
    console.error(error);
    return {
      message: "Error creating user",
    };
  }
}

export async function getUser() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { message: "No user session found" };
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        invitationCode: true,
        myCode: true,
        // Exclude sensitive fields like password, transactionPassword
      },
    });
    if (!user) {
      return { message: "User not found" };
    }
    console.log("User fetched successfully:", user);
    return { user };
  } catch (error) {
    console.error(error);
    return { message: "Error fetching user" };
  }
}
