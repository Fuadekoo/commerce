// "use client";
import React from "react";
import { auth } from "@/lib/auth";
// const session = await auth();
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {children}
    </div>
  );
}
