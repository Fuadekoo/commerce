"use server";
import prisma from "@/lib/db";
import { signupSchema } from "@/lib/zodSchema";
import { z } from "zod";
// import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/auth";

export async function deposit() {}

export async function DepositHistory() {}

export async function withdraw() {}

export async function WithdrawalHistory() {}
