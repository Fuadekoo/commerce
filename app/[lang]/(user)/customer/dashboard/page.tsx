"use client";
import React from "react";
import CardData from "./card-data";
import UserStat from "./user-stat";

function Page() {
  return (
    <div className="h-dvh gap-5 flex-col dashboard-grid overflow-auto mb-2">
      <div>
        <h1>Dashboard</h1>
        <CardData />
      </div>
      <div>
        <UserStat />
      </div>
    </div>
  );
}

export default Page;
