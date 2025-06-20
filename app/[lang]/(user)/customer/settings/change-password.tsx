"use client";
import React from "react";
import useAction from "@/hooks/useAction";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/toast";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { changePassword } from "@/actions/user/settings";
import { z } from "zod";

function ChangePassword() {
  const [, changePasswordAction, isLoadingChangePassword] = useAction(
    changePassword,
    [
      ,
      // initialData, can be null or an empty object
      (response) => {
        // Callback function after action execution
        if (response) {
          if (response.error) {
            addToast({
              title: "Error",
              description: response.error,
              // status: "error",
            });
          } else if (response.message) {
            addToast({
              title: "Success",
              description: response.message,
              // status: "success",
            });
            reset(); // Reset form fields on success
          }
        } else {
          addToast({
            title: "Error",
            description: "An unexpected error occurred.",
            // status: "error",
          });
        }
      },
    ]
  );

  const changePasswordSchema = z
    .object({
      currentPassword: z.string().min(6, "Current password is required"),
      newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters"),
      confirmPassword: z.string().min(8, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
    // The changePasswordAction expects (oldPassword: string, newPassword: string)
    await changePasswordAction(data.currentPassword, data.newPassword);
  };

  return (
    <div>
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Input
            type="password"
            label="Current Password"
            {...register("currentPassword")}
            // error={errors.currentPassword?.message}
          />
        </div>
        <div className="mb-4">
          <Input
            type="password"
            label="New Password"
            {...register("newPassword")}
            // error={errors.newPassword?.message}
          />
        </div>
        <div className="mb-4">
          <Input
            type="password"
            label="Confirm New Password"
            {...register("confirmPassword")}
            // error={errors.confirmPassword?.message}
          />
        </div>
        <Button
          type="submit"
          isLoading={isLoadingChangePassword}
          disabled={!isValid}
        >
          Change Password
        </Button>
      </form>
    </div>
  );
}

export default ChangePassword;
