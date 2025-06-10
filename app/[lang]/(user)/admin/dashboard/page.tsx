"use client";
import React from "react";
import DataCard from "./data-card";
import CustomerStat from "./customer-stat";
import Progress from "./progress";
import TopUsers from "./top-users";

function Page() {
  return (
    <div className="min-h-screen overflow-y-auto bg-slate-50 p-8 font-sans">
      <h1 className="text-slate-800 text-4xl font-bold mb-8 tracking-wide">
        Dashboard Overview
      </h1>

      <div className="grid gap-8 grid-cols-1">
        <div>
          <DataCard />
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <CustomerStat />
          </div>
          <div className="col-span-1">
            <Progress />
          </div>
        </div>
        <div className="mt-8">
          <TopUsers />
        </div>
      </div>
    </div>
  );
}

export default Page;
