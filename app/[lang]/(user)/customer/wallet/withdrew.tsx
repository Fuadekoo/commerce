"use client";
import React, { useState } from "react";
import useAction from "@/hooks/useAction";
// import { deposit } from "@/actions/user/wallet";
import { z } from "zod";
import { withdrawSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/toast";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { withdraw } from "@/actions/user/wallet";

const withdrawalMethods = [
  {
    value: "bank",
    label: "Bank Transfer",
    bank: "ABC Bank",
    account: "123456789",
  },
];

function Withdraw() {
  const [response, withdrawAction, withdrawLoading] = useAction(withdraw, [
    ,
    (response) => {
      if (response) {
        addToast({
          title: "Withdraw",
          description: response.message,
        });
      } else {
        addToast({
          title: "Withdraw",
          description: "Withdrawal successful!",
        });
      }
    },
  ]);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof withdrawSchema>>({
    resolver: zodResolver(withdrawSchema),
  });
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");

  const selectedMethod = withdrawalMethods.find((m) => m.value === method);

  return (
    <div className="flex justify-center mt-10">
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold"
        onClick={() => setOpen(true)}
      >
        Withdraw
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              Withdraw Money
            </h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(withdrawAction)}
            >
              <Input
                type="number"
                {...register("amount", {
                  valueAsNumber: true,
                })}
                min={1}
                placeholder="Enter amount"
                className="border rounded px-3 py-2"
                // value={amount}
                // onChange={(e) => setAmount(e.target.value)}
                required
              />

              <Input
                type="password"
                {...register("transactionPassword")}
                placeholder="Transaction password"
                className="border rounded px-3 py-2"
                required
              />

              {
                <Button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold mt-2"
                >
                  Done
                </Button>
              }
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Withdraw;
