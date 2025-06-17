"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
// import { data } from "framer-motion/client";
import { z } from "zod";
import { companyAccountSchema } from "@/lib/zodSchema";

export async function addCompanyAccount(
  data: z.infer<typeof companyAccountSchema>
) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  await prisma.campanyAccount.create({
    data: {
      ...data,
    },
  });
  return { message: "account is added successfully" };
}

export async function getCompanyAccount() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const companyAccount = await prisma.campanyAccount.findMany({});

  return companyAccount;
}

export async function updateCompanyAccount(
  id: string,
  data: Partial<z.infer<typeof companyAccountSchema>>
) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const companyAccount = await prisma.campanyAccount.update({
    where: { id },
    data,
  });

  return companyAccount;
}

export async function deleteCompanyAccount(id: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Unauthorized");
    }

    await prisma.campanyAccount.delete({
        where: { id },
    });

    return { message: "account is deleted successfully" };
}
