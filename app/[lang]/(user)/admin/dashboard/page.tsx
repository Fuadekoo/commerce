"use client";
import React from "react";
import DataCard from "./data-card";
import CustomerStat from "./customer-stat";
import Progress from "./progress";
import TopUsers from "./top-users";

function Page() {
  return (
    <div className="h-dvh gap-5 flex-col dashboard-grid overflow-auto mb-2">
      <h1 className="text-slate-800 text-4xl font-bold mb-8 tracking-wide">
        Dashboard Overview
      </h1>

      <div className="grid gap-8 grid-cols-1">
        <div>
          <DataCard />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <CustomerStat />
          </div>
          <div className="md:col-span-1">
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
