"use client";
import React from "react";
import useAction from "@/hooks/useAction";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/toast";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { changeTransactionPassword } from "@/actions/user/settings"; // Changed import
import { z } from "zod";

function ChangeTransactionPassword() {
  const [
    changeTransactionPasswordResponse,
    changeTransactionPasswordAction,
    isLoadingChangeTransactionPassword,
  ] = useAction(changeTransactionPassword, [
    ,
    // initialData, can be null or an empty object
    (response) => {
      // Callback function after action execution
      if (response) {
        if (response.error) {
          addToast({
            title: "Error",
            description: response.error,
            status: "error",
          });
        } else if (response.message) {
          addToast({
            title: "Success",
            description: response.message,
            status: "success",
          });
          reset(); // Reset form fields on success
        }
      } else {
        addToast({
          title: "Error",
          description: "An unexpected error occurred.",
          status: "error",
        });
      }
    },
  ]);

  // Schema for changing transaction password
  // Assuming similar password rules, adjust if different
  const changeTransactionPasswordSchema = z
    .object({
      currentPassword: z
        .string()
        .min(
          1,
          "Current transaction password is required (can be empty if setting for the first time and backend supports it, otherwise adjust min length)"
        )
        .or(z.literal("")), // Allow empty if setting for first time
      newPassword: z
        .string()
        .min(6, "New transaction password must be at least 6 characters"), // Adjusted min length for example
      confirmPassword: z
        .string()
        .min(6, "Please confirm your new transaction password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Transaction passwords do not match",
      path: ["confirmPassword"],
    });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof changeTransactionPasswordSchema>>({
    resolver: zodResolver(changeTransactionPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (
    data: z.infer<typeof changeTransactionPasswordSchema>
  ) => {
    // The changeTransactionPasswordAction expects (oldPassword: string, newPassword: string)
    await changeTransactionPasswordAction(
      data.currentPassword,
      data.newPassword
    );
  };

  return (
    <div>
      <h1>Change Transaction Password</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Input
            type="password"
            label="Current Transaction Password"
            {...register("currentPassword")}
            error={errors.currentPassword?.message}
            placeholder="Leave empty if setting for the first time"
          />
        </div>
        <div className="mb-4">
          <Input
            type="password"
            label="New Transaction Password"
            {...register("newPassword")}
            error={errors.newPassword?.message}
          />
        </div>
        <div className="mb-4">
          <Input
            type="password"
            label="Confirm New Transaction Password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
        </div>
        <Button
          type="submit"
          isLoading={isLoadingChangeTransactionPassword}
          disabled={!isValid}
        >
          Change Transaction Password
        </Button>
      </form>
    </div>
  );
}

export default ChangeTransactionPassword;
