"use client";
import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";

function Home() {
  const router = useRouter();

  useEffect(() => {
    redirect("/en/login");
  }, [router]);

  return null;
}

export default Home;
