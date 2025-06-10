"use client";
import React from "react";
import Deposit from "./deposit";
import DepositHistory from "./deposit-history";
import Withdraw from "./withdrew";
import WithdrawalHistory from "./withdrewal-history";

function Page() {
  return (
    <div>
      <h1>this is a wallet page </h1>
      <Deposit />
      <DepositHistory />
      <Withdraw />
      <WithdrawalHistory />
    </div>
  );
}

export default Page;
