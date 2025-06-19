"use client";
import React, { useState } from "react";
import Image from "next/image";
import { User, Phone, Pen, X } from "lucide-react";
import useAction from "@/hooks/useAction";
import { viewProfile, profileUpdate } from "@/actions/common/profile";
import { Button, Input } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { updateProfileSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "@/components/loading";

function Page() {
  const [user, refresh, isLoadingUser] = useAction(viewProfile, [
    true,
    () => {},
  ]);
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(updateProfileSchema),
  });

  const [updateResponse, updateAction, isLoadingUpdate] = useAction(
    profileUpdate,
    [, () => {}]
  );

  const openModal = () => setShowModal(true);

  if (isLoadingUser) {
    // You can use your own Loading component or a skeleton here
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8 px-2 md:px-4 overflow-auto">
      <div className="max-w-2xl mx-auto rounded-2xl shadow-xl p-6 md:p-10 flex flex-col gap-8 items-center bg-white">
        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="relative">
            <Image
              src="/profile.jpg"
              width={120}
              height={120}
              priority
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-gray-400 shadow-lg ring-4 ring-green-100 object-cover"
            />
            <span className="absolute bottom-2 right-2 bg-black rounded-full p-1 border-2 border-white">
              <User className="w-5 h-5 text-white" />
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-2 text-center">Profile</h1>
        </div>
        {/* User Info */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:gap-8">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">Name</label>
              <div className="text-lg font-semibold text-gray-800 bg-gray-50 rounded px-3 py-2">
                {user?.username || "-"}
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2 mt-4 md:mt-0">
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 bg-gray-50 rounded px-3 py-2">
                <Phone className="w-4 h-4 text-gray-400" />
                {user?.phone || "-"}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <label className="text-sm font-medium text-gray-600">Email</label>
            <div className="text-base text-gray-700 bg-gray-50 rounded px-3 py-2">
              {user?.email || "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
