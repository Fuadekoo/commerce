"use client";
import React, { useEffect } from "react";
import useAction from "@/hooks/useAction";
import { myAccount, setMyAccount } from "@/actions/common/profile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { Loader2 } from "lucide-react";

// Define schema for wallet address
const walletSchema = z.object({
  wallet: z.string().min(5, "Wallet address is required"),
});

function SetAccount() {
  const [account, fetchAccount, isLoading] = useAction(myAccount, [
    true,
    () => {},
  ]);
  const [setResponse, setAccountAction, isLoadingSet] = useAction(
    setMyAccount,
    [
      ,
      (response) => {
        if (response && response.message) {
          addToast({
            title: "Set Account",
            description: response.message,
          });
        } else {
          addToast({
            title: "Set Account",
            description: "Account updated successfully!",
          });
        }
        fetchAccount();
      },
    ]
  );

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof walletSchema>>({
    resolver: zodResolver(walletSchema),
    defaultValues: { wallet: "" },
  });

  // Set form value if account is loaded
  useEffect(() => {
    if (account && account.walletAddress != null) {
      setValue("wallet", account.walletAddress);
    }
  }, [account, setValue]);

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">
        {account && account.walletAddress
          ? "Edit Wallet Address"
          : "Add Wallet Address"}
      </h2>
      <form
        onSubmit={handleSubmit((data) => setAccountAction(data.wallet))}
        className="flex flex-col gap-4"
      >
        <Input
          label="Wallet Address"
          placeholder="Enter your wallet address"
          {...register("wallet")}
          disabled={isLoadingSet}
        />
        {errors.wallet && (
          <span className="text-red-500 text-xs">{errors.wallet.message}</span>
        )}
        <Button
          color="primary"
          type="submit"
          isLoading={isLoadingSet}
          disabled={isLoadingSet}
          className="w-full"
        >
          {isLoadingSet ? (
            <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
          ) : null}
          {account && account.walletAddress ? "Update" : "Add"}
        </Button>
        {isLoading && (
          <div className="flex justify-center items-center mt-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          </div>
        )}
      </form>
      {account && account.walletAddress && (
        <div className="mt-4 text-center text-gray-600">
          <span className="font-semibold">Current Wallet Address:</span>
          <div className="break-all">{account.walletAddress}</div>
        </div>
      )}
    </div>
  );
}

export default SetAccount;
