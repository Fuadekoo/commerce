import React from "react";
import ProfitCard from "./profit-card";

function Page() {
  return (
    <div className="h-dvh gap-8 flex flex-col overflow-y-auto mb-2 px-4 py-8 bg-gray-50">
      <h1>profit cards</h1>
      <ProfitCard />
    </div>
  );
}

export default Page;
