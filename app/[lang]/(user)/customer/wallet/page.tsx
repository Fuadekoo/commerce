"use client";
import React from "react";
import Deposit from "./deposit";
import DepositHistory from "./deposit-history";
import Withdraw from "./withdrew";
import WithdrawalHistory from "./withdrewal-history";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";

function Page() {
  // Example balance, replace with your actual balance source
  const balance = 5000;

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl font-bold">Total Balance:</span>
        <span className="text-3xl font-extrabold text-blue-700">
          Br {balance.toLocaleString()}
        </span>
      </div>
      <Tabs aria-label="Wallet Tabs" variant="light">
        <Tab key="deposit" title="Deposit">
          <Card>
            <CardBody>
              <div className="flex justify-end">
                <Deposit />
              </div>

              <div className="mt-1">
                <DepositHistory />
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="withdrawal" title="Withdrawal">
          <Card>
            <CardBody>
              <div className="flex justify-end">
                <Withdraw />
              </div>
              <div className="mt-1">
                <WithdrawalHistory />
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}

export default Page;
