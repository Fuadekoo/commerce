import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginPage from "./login-page";

export default async function Page() {
  const session = await auth();

  if (session?.user?.role === "ADMIN") {
    redirect("/en/admin/dashboard");
  } else if (session?.user?.role) {
    redirect("/en/customer/dashboard");
  }
  return <LoginPage />;
}
