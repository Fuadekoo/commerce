"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { User, Users, Phone, Pen, X } from "lucide-react";
import useAction from "@/hooks/useAction";
import { viewProfile, profileUpdate } from "@/actions/common/profile";
import { Button, Input } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { updateProfileSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function Page() {
  const [user] = useAction(viewProfile, [true, () => {}]);
  const [showModal, setShowModal] = useState(false);

  const [, updateAction] = useAction(profileUpdate, [
    ,
    (res) => {
      addToast({
        title: res?.message ? "Profile Updated" : "Error",
        description: res?.message || "Update failed",
      });
      setShowModal(false);
    },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.username || "",
        phone: user.phone || "",
      });
    }
  }, [user, reset]);

  const openModal = () => setShowModal(true);

  const onSubmit = (data: any) => {
    updateAction({
      name: data.name,
      phone: data.phone,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8 px-2 md:px-4 overflow-auto">
      <div className="max-w-3xl mx-auto rounded-2xl shadow-xl p-4 md:p-8 flex flex-col gap-10 items-center bg-white">
        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="relative">
            <h1 className="text-2xl font-bold mb-2 text-center">Profile</h1>
            <Image
              src="/profile.jpg"
              width={120}
              height={120}
              priority
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-green-400 shadow-lg ring-4 ring-green-100 object-cover"
            />
            <span className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1 border-2 border-white">
              <User className="w-5 h-5 text-white" />
            </span>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          <div className="flex flex-col items-center">
            <Users className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-2xl font-bold text-blue-700">
              {/* {user?.invitedUsers ?? "0"} */}
            </p>
            <p className="text-gray-500 text-sm mt-1">Invited Users</p>
          </div>
        </div>
        {/* Profile Info */}
        <div className="w-full flex flex-col items-center">
          <Button
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2 shadow transition mb-2"
            onClick={openModal}
          >
            <Pen className="w-5 h-5" />
            Update
          </Button>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-1">
            {user?.username || "User"}
          </h2>
          <div className="flex items-center gap-2 text-gray-500 text-lg">
            <Phone className="w-4 h-4" />
            <span>{user?.phone}</span>
          </div>
        </div>
      </div>
      {/* Update Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-2 animate-fadeIn">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <span className="text-lg font-bold">Update Profile</span>
              <button
                className="p-1 rounded hover:bg-gray-100"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4 px-6 py-6">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="name"
                >
                  Name
                </label>
                <Input
                  id="name"
                  {...register("name")}
                  autoFocus
                  className="mb-1"
                />
                {errors.name && (
                  <span className="text-red-500 text-xs">
                    {errors.name.message as string}
                  </span>
                )}
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <Input id="phone" {...register("phone")} className="mb-1" />
                {errors.phone && (
                  <span className="text-red-500 text-xs">
                    {errors.phone.message as string}
                  </span>
                )}
              </div>
              <div className="flex justify-end gap-2 border-t px-6 py-4">
                <Button
                  variant="flat"
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-24"
                >
                  Cancel
                </Button>
                <Button color="primary" type="submit" className="w-24">
                  Save
                </Button>
              </div>
            </form>
          </div>
          <style jsx global>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fadeIn {
              animation: fadeIn 0.2s ease;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default Page;
