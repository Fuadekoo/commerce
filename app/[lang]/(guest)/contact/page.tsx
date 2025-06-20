"use client";
import React, { useState } from "react";
import { Button, Input, Textarea } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { createContact } from "@/actions/guest/contact";
import { useForm } from "react-hook-form";
import { contactSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useAction from "@/hooks/useAction";
import Link from "next/link";
import { MessageCircleCode } from "lucide-react";

function Page() {
  const { handleSubmit, register } = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
  });
  const [, createAction, isLoadingCreate] = useAction(createContact, [
    ,
    (createResponse) => {
      if (createResponse && createResponse.message) {
        addToast({
          title: "Contact",
          description: createResponse.message,
        });
      } else {
        addToast({
          title: "Contact",
          description: "Contact created successfully!",
        });
      }
    },
  ]);

  const [username, setUsername] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Animated Message Icon */}
      <Link
        href="/en/chat"
        className="fixed bottom-6 right-6 z-50 animate-bounce hover:text-red-600"
      >
        <MessageCircleCode className="w-12 h-12 text-blue-500 drop-shadow-lg cursor-pointer" />
      </Link>
      {/* Contact Form */}
      <form
        onSubmit={handleSubmit((data) => {
          createAction(data);
        })}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md flex flex-col gap-5"
      >
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">
          Contact Assistance
        </h1>
        <Input
          {...register("username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          {...register("phone")}
          type="number"
          placeholder="Enter your phone"
          required
        />
        <Textarea
          {...register("description")}
          placeholder="Describe your issue"
          required
          rows={4}
        />
        <Button
          color="primary"
          type="submit"
          isLoading={isLoadingCreate}
          disabled={isLoadingCreate}
          className="w-full"
        >
          Submit Report
        </Button>
        <div className="mt-2 text-center">
          <span className="text-gray-500 text-sm">
            Go back to{" "}
            <Link
              href="/en/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}

export default Page;
