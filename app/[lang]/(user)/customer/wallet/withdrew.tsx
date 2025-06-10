"use client";
import React, { useState } from "react";

const withdrawalMethods = [
  {
    value: "bank",
    label: "Bank Transfer",
    bank: "ABC Bank",
    account: "123456789",
  },
];

function Withdraw() {
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
                <option value="">Select withdrawal method</option>
                {withdrawalMethods.map((m) => (
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
                    <span className="font-semibold">User Account:</span>{" "}
                    {selectedMethod.account}
                  </div>
                </div>
              )}

              {selectedMethod && (
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold mt-2"
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

export default Withdraw;
