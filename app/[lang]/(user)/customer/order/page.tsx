"use client";
import React from "react";
import Summary from "./summary";

function page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-y-auto h-dvh w-auto">
      <div>
        <Summary />
      </div>
    </div>
  );
}

export default page;
