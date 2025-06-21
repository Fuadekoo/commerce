"use client";
import React, { useState, useEffect } from "react";
import useAction from "@/hooks/useAction";
import { newUser } from "@/actions/user/newUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signupSchema } from "@/lib/zodSchema";
import { z } from "zod";
import { Input } from "@heroui/react";
import Loading from "@/components/loading";
import { Button, Progress } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function Page() {
  const searchParams = useSearchParams();
  const invitationCodeFromUrl = searchParams?.get("invitationCode") || "";
  const [step, setStep] = useState(1);
  const totalSteps = 2;

  const {
    handleSubmit,
    register,
    formState: { errors },
    trigger,
    reset,
    setValue, // <-- add setValue here
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      invitationCode: invitationCodeFromUrl,
    },
  });

  // Update invitationCode if it changes in the URL
  useEffect(() => {
    if (invitationCodeFromUrl) {
      setValue("invitationCode", invitationCodeFromUrl);
    }
  }, [invitationCodeFromUrl, setValue]);

  const [response, action, isLoading] = useAction(newUser, [
    ,
    (response) => {
      addToast({
        title: "Signup",
        description: response.message,
      });
    },
  ]);

  useEffect(() => {
    if (response?.message) {
      reset();
      setStep(1);
    }
  }, [response, reset]);

  const handleNext = async () => {
    // Validate only fields in step 1
    const valid = await trigger([
      "username",
      "phone",
      "email",
      "invitationCode",
    ]);
    if (valid) setStep(2);
  };

  const handleBack = () => setStep(1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-6">
          Register
        </h1>
        <Progress
          value={(step / totalSteps) * 100}
          color="success"
          className="mb-4"
        />
        <form
          onSubmit={handleSubmit(action)}
          className="flex flex-col gap-2"
          autoComplete="off"
        >
          {step === 1 && (
            <>
              <Input
                type="text"
                {...register("username")}
                placeholder="Username"
                className="w-full"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username?.message}
                </p>
              )}
              <Input
                type="tel"
                {...register("phone")}
                placeholder="Phone"
                className="w-full"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone?.message}
                </p>
              )}
              <Input
                type="email"
                {...register("email")}
                placeholder="Email"
                className="w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email?.message}
                </p>
              )}
              <Input
                type="text"
                {...register("invitationCode")}
                placeholder="Invitation Code"
                className="w-full"
              />
              {errors.invitationCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.invitationCode?.message}
                </p>
              )}
              <Button
                type="button"
                color="secondary"
                variant="flat"
                className="mt-2 w-full"
                onClick={handleNext}
              >
                Next
              </Button>
              <div className="mt-4 text-center">
                <span className="text-gray-600">Are you have a account? </span>
                <Link
                  href="/en/login"
                  className="text-green-600 font-semibold hover:underline"
                >
                  Login
                </Link>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <Input
                type="password"
                {...register("password")}
                placeholder="Password"
                className="w-full"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password?.message}
                </p>
              )}
              <Input
                type="password"
                {...register("transactionPassword")}
                placeholder="Transaction Password"
                className="w-full"
              />
              {errors.transactionPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.transactionPassword?.message}
                </p>
              )}
              <Input
                type="password"
                {...register("confirmPassword")}
                placeholder="Confirm Password"
                className="w-full"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword?.message}
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  color="default"
                  variant="flat"
                  onClick={handleBack}
                  className="w-1/2"
                >
                  Back
                </Button>
                <Button
                  isDisabled={isLoading}
                  color="secondary"
                  variant="flat"
                  type="submit"
                  className="w-1/2"
                >
                  {isLoading ? <Loading size={20} /> : "Signup"}
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default Page;
