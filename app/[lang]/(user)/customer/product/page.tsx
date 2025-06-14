"use client";
import React from "react";
import ProductList from "./product-list";

function Page() {
  return (
    <div className="h-dvh gap-5 flex-col overflow-y-auto mb-2">
      <ProductList />
    </div>
  );
}

export default Page;
