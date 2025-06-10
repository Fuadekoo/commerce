import React from "react";
import CardData from "./card-data";
import UserStat from "./user-stat";

function Page() {
  return (
    <div className="dashboard-grid">
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
