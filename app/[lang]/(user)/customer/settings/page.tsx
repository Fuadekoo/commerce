"use client";
import React from "react";
import ChangePassword from "./change-password";
import ChangeTransactionPassword from "./change-transactionpassword";
import SetAccount from "./set-account";

function Page() {
  return (
    <div className="h-dvh gap-8 flex flex-col overflow-y-auto mb-2 px-2 md:px-4 py-6 md:py-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Settings</h1>
      <div className="flex flex-col gap-8 md:grid md:grid-cols-2 md:gap-8">
        {/* Left column: Set Account and Change Password */}
        <div className="flex flex-col gap-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Set Account
            </h2>
            <SetAccount />
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Change Password
            </h2>
            <ChangePassword />
          </div>
        </div>
        {/* Right column: Change Transaction Password */}
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
