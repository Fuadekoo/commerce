"use client";
import React, { useState } from "react"; // Added useEffect
import useAction from "@/hooks/useAction";
// Ensure the server action is named 'deposits' if that's what you are importing
import { getCompanyAccount, deposits } from "@/actions/user/wallet";
import { z } from "zod";
// This schema should expect 'photo' as a string (base64)
import { depositSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/toast";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Loader2 } from "lucide-react"; // For loading state
// import Image from "next/image";

// Define a type for the company account data for clarity
// interface CompanyAccount {
//   id: string;
//   name: string;
//   account: string;
// }

interface DepositProps {
  onDepositSuccess?: () => void;
}

function Deposit({ onDepositSuccess }: DepositProps) {
  const [open, setOpen] = useState(false);
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset, // Added reset
    formState: { errors, isValid }, // Added isValid
  } = useForm<z.infer<typeof depositSchema>>({
    resolver: zodResolver(depositSchema), // Schema expects photo as base64 string
    mode: "onChange", // Validate on change
  });
  const [accountData, accountRefresh, isLoadingAccount] = useAction(
    getCompanyAccount,
    [true, () => {}]
  );
  const [, depositAction, depositLoading] = useAction(deposits, [
    ,
    // initialValue for response
    (res) => {
      // Changed variable name from response to res
      if (res && res.message) {
        addToast({
          title: "Deposit",
          description: res.message,
        });
        if (onDepositSuccess) onDepositSuccess();
        setOpen(false);
        reset();
      } else if (res) {
        addToast({
          title: "Deposit",
          description: "Deposit request processed.", // Generic success
        });
        if (onDepositSuccess) onDepositSuccess();
        setOpen(false);
        reset();
      } else {
        addToast({
          title: "Deposit Error",
          description: "An unexpected error occurred.",
        });
      }
    },
  ]);

  const [isConvertingImage, setIsConvertingImage] = useState(false); // For loading state during conversion

  // If your backend doesn't use 'method', you might not need this useEffect
  // or the 'method' field in your form/schema.
  // useEffect(() => {
  //   if (accountData && accountData.id) {
  //     setValue("method", accountData.id, { shouldValidate: true });
  //   } else {
  //     setValue("method", "", { shouldValidate: true });
  //   }
  // }, [accountData, setValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsConvertingImage(true);
      setValue("photo", "", { shouldValidate: false }); // Clear previous photo immediately

      try {
        const fileBuffer = await file.arrayBuffer();
        const base64String = Buffer.from(fileBuffer).toString("base64");
        // The backend expects a raw base64 string.
        // If it expected a data URL, you'd prepend `data:${file.type};base64,`
        setValue("photo", base64String, { shouldValidate: true });
      } catch (error) {
        console.error("Error converting file to base64:", error);
        addToast({
          title: "Image Error",
          description: "Could not process the file.",
        });
        setValue("photo", "", { shouldValidate: true }); // Clear on error
      } finally {
        setIsConvertingImage(false);
      }
    } else {
      setValue("photo", "", { shouldValidate: true }); // Clear if no file selected
    }
  };

  const photoValue = watch("photo"); // This will be the base64 string

  // Wrapper function for form submission
  const onSubmitWrapper = async (data: z.infer<typeof depositSchema>) => {
    console.log("Form data being sent to backend:", data);
    // 'data.photo' is already a base64 string here due to handleFileChange and setValue

    if (!data.photo) {
      // Should be caught by Zod, but good for an extra check
      addToast({
        title: "Validation Error",
        description: "Payment proof photo is required.",
      });
      return;
    }
    // If your backend needs 'method', ensure it's included in 'data'
    // and that 'accountData' is loaded if 'method' depends on it.
    // if (!accountData && data.method) { // Example check if method is required
    //     addToast({ title: "Error", description: "Payment method details are not available.", type: "error" });
    //     return;
    // }

    await depositAction(data); // 'data' contains { amount: number, photo: string (base64) }
  };

  const handleOpenModal = () => {
    reset(); // Reset form fields and errors
    // No image preview URL to clear if photoValue is just the base64 string
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
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold"
          onClick={handleOpenModal}
        >
          Deposit
        </Button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative max-h-[90vh] overflow-y-auto">
            <Button
              variant="ghost"
              // size="icon"
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
              Deposit Money
            </h2>

            {/* Account Info Display - Keep if 'method' is used, otherwise can be simplified/removed */}
            <div className="flex items-center gap-2 mb-4">
              {isLoadingAccount ? (
                <div className="flex items-center justify-center p-2">
                  <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                  <span className="ml-2">Loading ...</span>
                </div>
              ) : accountData ? (
                <div className="flex-1 bg-gray-50 p-3 rounded border text-sm">
                  <div className="font-semibold">Wallat Information</div>
                  <div>
                    <span className="block"> {accountData.name}</span>
                    <span className="block">
                      Address: {accountData.account}
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={accountRefresh}
                    className="ml-auto mt-1 text-xs"
                    variant="flat"
                  >
                    Refresh
                  </Button>
                  {/* HElp me i went to add a copy icon when the butto nis click it copy the account number */}
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(accountData.account);
                      addToast({
                        title: "Copied",
                        description: "Account number copied to clipboard.",
                      });
                    }}
                    className="ml-2 mt-1 text-xs"
                    variant="faded"
                  >
                    Copy Account
                  </Button>
                </div>
              ) : (
                <div className="text-center p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                  No bank account available.
                  <Button
                    variant="faded"
                    size="sm"
                    onClick={() => accountRefresh()}
                    className="mt-1 text-xs"
                  >
                    Try Refresh
                  </Button>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit(onSubmitWrapper)} // Use the wrapper
              className="flex flex-col gap-4"
            >
              <div>
                <Input
                  type="number"
                  {...register("amount")}
                  min={1}
                  placeholder="Enter amount"
                  className="w-full"
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* If 'method' is part of your schema and backend logic, unhide and use it */}
              {/* <input type="hidden" {...register("method")} />
              {errors.method && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.method.message}
                  </p>
              } */}

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Upload Payment Proof
                </label>
                <Input
                  type="file"
                  // The {...register("photo")} is not strictly needed here if handleFileChange
                  // is the sole manager of the "photo" field's value via setValue.
                  // However, keeping it doesn't hurt and might be useful if you later
                  // want to access the FileList directly for some reason before conversion.
                  // For this setup, `onChange` is primary.
                  {...register("photo", { onChange: handleFileChange })} // Or just onChange={handleFileChange}
                  accept="image/*"
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  disabled={isConvertingImage}
                />
                {isConvertingImage && (
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    Processing image...
                  </div>
                )}
                {errors.photo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.photo.message as string}
                  </p>
                )}
              </div>

              {/* Image preview using the base64 string */}
              {photoValue &&
                typeof photoValue === "string" &&
                !isConvertingImage && (
                  <div className="mt-2 border rounded-md p-2">
                    <span className="text-xs text-gray-500 block text-center mb-1">
                      Preview
                    </span>
                    <img
                      // Assuming the backend expects raw base64, but for display, you need a data URL.
                      // The backend code snippet implies it can handle raw base64 OR data URL.
                      // If photoValue is raw base64, you need to prepend the data URL scheme for the <img> src.
                      // You'll need to know the image type. For simplicity, assuming jpeg.
                      // A more robust way is to store the file.type in handleFileChange and use it here.
                      src={`data:image/jpeg;base64,${photoValue}`}
                      alt="Payment proof preview"
                      className="max-h-40 rounded mx-auto"
                    />
                  </div>
                )}

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-bold mt-2"
                disabled={
                  !isValid ||
                  depositLoading ||
                  isConvertingImage /* || isLoadingAccount || !accountData */
                } // Disable if method is required and not loaded
              >
                {depositLoading || isConvertingImage ? (
                  <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                ) : null}
                {depositLoading
                  ? "Processing..."
                  : isConvertingImage
                  ? "Processing Image..."
                  : "Confirm Deposit"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Deposit;
