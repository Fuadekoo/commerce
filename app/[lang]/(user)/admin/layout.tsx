// "use client";
import React from "react";
import { auth } from "@/lib/auth";
import UserLayout from "@/components/userLayout";
import { redirect } from "next/navigation";

const menu = [
  { label: "Dashboard", url: "dashboard", icon: <span>🏠</span> },
  { label: "Profile", url: "profile", icon: <span>👤</span> },
  { label: "Settings", url: "settings", icon: <span>⚙️</span> },
  { label: "Users", url: "users", icon: <span>👥</span> },
  { label: "Reports", url: "reports", icon: <span>📊</span> },
  { label: "Help", url: "help", icon: <span>❓</span> },
  { label: "Logout", url: "logout", icon: <span>🚪</span> },
  // Add more menu items as needed
];

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // if the login user is admin then redirect to admin dashboard else redirect to customer dashboard
  // if (session?.user?.role === "ADMIN") {
  //   redirect("/en/admin/dashboard");
  // } else if (session?.user?.role === "USER") {
  //   redirect("/en/customer/dashboard");
  // }

  const isManager = true;

  return (
    <UserLayout menu={menu} isManager={isManager}>
      {children}
    </UserLayout>
  );
}
