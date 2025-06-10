"use client";
import React, { useState } from "react";
const paymentMethods = [
  {
    value: "bank",
    label: "Bank Transfer",
    bank: "ABC Bank",
    account: "123456789",
  },
  {
    value: "paypal",
    label: "PayPal",
    bank: "PayPal",
    account: "user@paypal.com",
  },
];

function Deposit() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const selectedMethod = paymentMethods.find((m) => m.value === method);

  return (
    <div className="flex justify-center mt-10">
      <button
        className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold"
        onClick={() => setOpen(true)}
      >
        Deposit
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
              Deposit Money
            </h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                // handle submit here
                setOpen(false);
              }}
            >
              <input
                type="number"
                min={1}
                placeholder="Enter amount"
                className="border rounded px-3 py-2"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />

              <select
                className="border rounded px-3 py-2"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                required
              >
                <option value="">Select payment method</option>
                {paymentMethods.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              {selectedMethod && (
                <div className="bg-gray-50 p-3 rounded border">
                  <div>
                    <span className="font-semibold">Bank:</span>{" "}
                    {selectedMethod.bank}
                  </div>
                  <div>
                    <span className="font-semibold">Account:</span>{" "}
                    {selectedMethod.account}
                  </div>
                </div>
              )}

              {selectedMethod && (
                <div>
                  <label className="block mb-1 font-semibold">
                    Upload Payment Proof
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                    className="block"
                    required
                  />
                </div>
              )}

              {selectedMethod && photo && (
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-bold mt-2"
                >
                  Done
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Deposit;
