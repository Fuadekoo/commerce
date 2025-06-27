"use client";
import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import LoginPage from "./[lang]/(guest)/login/login-page";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    redirect("/en/login");
  }, [router]);

  return <LoginPage />;
}

