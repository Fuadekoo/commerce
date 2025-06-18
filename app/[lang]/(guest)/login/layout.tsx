"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";

function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export default Layout;
