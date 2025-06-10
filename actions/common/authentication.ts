"use server";
import { signIn, signOut } from "../../lib/auth";
import { z } from "zod";
import { loginSchema } from "@/lib/zodSchema";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
export async function authenticate(
  data?: z.infer<typeof loginSchema> | undefined
): Promise<{ message: string } | undefined> {
  if (!data) return { message: "No data provided" };
  let result;
  try {
    result = await signIn("credentials", { ...data, redirect: false });
  } catch (error) {
    console.log("sign in failed", error);
    return { message: "Invalid email or password" };
  }
  if (result && result.error) {
    console.log("sign in failed", result.error);
    return { message: "Invalid email or password" };
  }
  console.log("sign in successfully");
  // before redirect display a success message return

  // Fetch user role from DB
  const user = await prisma.user.findUnique({
    where: { phone: data.phone },
    select: { role: true },
  });

  // Redirect based on role
  if (user?.role === "ADMIN") {
    redirect("/en/admin/dashboard");
  } else {
    redirect("/en/customer/dashboard");
  }

  return { message: "Login successful" };
  return { message: "Login successful" };
}

export async function logout() {
  try {
    await signOut({ redirect: false });
    redirect("/en/guest/login");
    return { message: "Logout successful", status: true };
  } catch (error) {
    console.error("Logout failed:", error);
    return { message: "Logout failed", status: false };
  }
}
export async function checkAuthentication() {
  const session = await signIn("credentials", { redirect: false });
  if (!session || !session.user) {
    redirect("/en/guest/login");
  }
  return session;
}
