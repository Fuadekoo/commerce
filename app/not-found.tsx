"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@heroui/react";
import Link from "next/link"; // Re-adding Link for navigation

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-lg mb-4">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <div className="animate-pulse mb-6">
        <Image
          src="/errorphoto.png"
          alt="Page Not Found"
          width={300}
          height={300}
        />
      </div>
      <Link href="/" passHref>
        <Button color="primary" variant="shadow" className="mt-4">
          Go back to Home
        </Button>
      </Link>
    </div>
  );
}
