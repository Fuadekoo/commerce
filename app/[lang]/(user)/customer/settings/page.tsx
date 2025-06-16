"use client";
import React from "react";
import ChangePassword from "./change-password";
import ChangeTransactionPassword from "./change-transactionpassword";

function Page() {
  return (
    <div className="h-dvh gap-8 flex flex-col overflow-y-auto mb-2 px-4 py-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Change Password
          </h2>
          <ChangePassword />
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Change Transaction Password
          </h2>
          <ChangeTransactionPassword />
        </div>
      </div>
    </div>
  );
}

export default Page;
