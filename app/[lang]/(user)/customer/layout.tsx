import React from "react";
import { auth } from "@/lib/auth";
import UserLayout from "@/components/userLayout";
import { redirect } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Package,
  CreditCard,
  User,
  Settings,
} from "lucide-react";

const menu = [
  { label: "Dashboard", url: "dashboard", icon: <Home size={18} /> },
  { label: "Product", url: "product", icon: <ShoppingCart size={18} /> },
  { label: "Orders", url: "order", icon: <Package size={18} /> },
  { label: "Wallet", url: "wallet", icon: <CreditCard size={18} /> },
  { label: "Profile", url: "profile", icon: <User size={18} /> },
  { label: "Settings", url: "settings", icon: <Settings size={18} /> },
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
