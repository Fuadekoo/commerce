"use client";
import React from "react";
import DataCard from "./data-card";
import CustomerStat from "./customer-stat";
import Progress from "./progress";

function Page() {
  return (
    <div className="min-h-screen overflow-y-auto bg-slate-50 p-8 font-sans">
      <h1 className="text-slate-800 text-4xl font-bold mb-8 tracking-wide">
        Dashboard Overview
      </h1>

      <div className="flex gap-8 flex-wrap">
        <div className="w-full mb-8">
          <DataCard />
        </div>
        <div className="flex w-full gap-8 h-4">
          <div className="flex-2">
            <CustomerStat />
          </div>
          <div className="flex-1">
            <Progress />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
