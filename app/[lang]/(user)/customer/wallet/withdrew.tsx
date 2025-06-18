"use client";
import React, { useState } from "react";
import useAction from "@/hooks/useAction";
import { z } from "zod";
import { withdrawSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/toast";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { withdraw } from "@/actions/user/wallet";
import { Loader2 } from "lucide-react";

interface WithdrawProps {
  onWithdrawSuccess?: () => void;
}

function Withdraw({ onWithdrawSuccess }: WithdrawProps) {
  const [open, setOpen] = useState(false);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof withdrawSchema>>({
    resolver: zodResolver(withdrawSchema),
    mode: "onChange",
  });

  const [, withdrawAction, withdrawLoading] = useAction(withdraw, [
    ,
    (response) => {
      if (response && response.message) {
        addToast({
          title: "Withdraw",
          description: response.message,
        });
        if (onWithdrawSuccess) onWithdrawSuccess();
        setOpen(false);
        reset();
      } else if (response) {
        addToast({
          title: "Withdraw",
          description: "Withdrawal successful!",
        });
        if (onWithdrawSuccess) onWithdrawSuccess();
        setOpen(false);
        reset();
      } else {
        addToast({
          title: "Withdraw Error",
          description: "An unexpected error occurred.",
        });
        setOpen(false);
        reset();
      }
    },
  ]);

  const handleOpenModal = () => {
    reset();
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    reset();
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="flex justify-end w-full">
        <Button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold"
          onClick={handleOpenModal}
        >
          Withdraw
        </Button>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative max-h-[90vh] overflow-y-auto">
            <Button
              variant="ghost"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={handleCloseModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
            <h2 className="text-xl font-bold mb-6 text-center">
              Withdraw Money
            </h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(withdrawAction)}
            >
              <div>
                <Input
                  type="number"
                  {...register("amount", { valueAsNumber: true })}
                  min={1}
                  placeholder="Enter amount"
                  className="w-full"
                  required
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  type="password"
                  {...register("transactionPassword")}
                  placeholder="Transaction password"
                  className="w-full"
                  required
                />
                {errors.transactionPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.transactionPassword.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold mt-2"
                disabled={!isValid || withdrawLoading}
              >
                {withdrawLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                ) : null}
                {withdrawLoading ? "Processing..." : "Confirm Withdraw"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Withdraw;
