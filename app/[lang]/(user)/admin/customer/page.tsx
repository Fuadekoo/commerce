"use client";
import React from "react";
import CustomerPage from "./customer-list";

function Page() {
  return (
    <div className="h-dvh gap-5 flex flex-col overflow-y-auto mb-2">
      <CustomerPage />
    </div>
  );
}

export default Page;
