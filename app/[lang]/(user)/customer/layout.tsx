// "use client";
import React from "react";
import { auth } from "@/lib/auth";
import UserLayout from "@/components/userLayout";
import { redirect } from "next/navigation";

const menu = [
  { label: "Dashboard", url: "dashboard", icon: <span>🏠</span> },
  { label: "Product", url: "product", icon: <span>🛒</span> },
  { label: "Orders", url: "order", icon: <span>📦</span> },
  { label: "Wallet", url: "wallet", icon: <span>💳</span> },
  { label: "Profile", url: "profile", icon: <span>👤</span> },
  { label: "Settings", url: "settings", icon: <span>⚙️</span> },

  // Add more menu items as needed
];

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const isManager = false;

  return (
    <UserLayout menu={menu} isManager={isManager}>
      {children}
    </UserLayout>
  );
}
