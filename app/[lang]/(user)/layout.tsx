import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/en/login");
  }

  // Optionally render children if you want to allow access
  return <div className="overflow-y-auto">{children}</div>;
}
