"use client";
import React from "react";
import Deposit from "./deposit";
import DepositHistory from "./deposit-history";
import Withdraw from "./withdrew";
import WithdrawalHistory from "./withdrewal-history";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import useAction from "@/hooks/useAction";
import { viewProfile } from "@/actions/common/profile";

function Page() {
  const [profile] = useAction(viewProfile, [true, () => {}]);
  // Example balance, replace with your actual balance source
  const balance = profile?.balance || 0;

  return (
    <div className="h-dvh gap-5 flex-col overflow-auto">
      <div className="flex items-center gap-2 mb-1 overflow-hidden">
        <span className="text-2xl font-bold">Total Balance:</span>
        <span className="text-3xl font-extrabold text-blue-700">
          $ {balance.toLocaleString()}
        </span>
      </div>
      {/* <div className="shrink-0 bg-green-500 h-dvh">here</div>
      <div className="shrink-0 bg-red-500 h-dvh">here</div> */}
      <Tabs aria-label="Wallet Tabs" variant="light">
        <Tab key="deposit" title="Deposit">
          <Card>
            <CardBody>
              <Deposit />
              <DepositHistory />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="withdrawal" title="Withdrawal">
          <Card>
            <CardBody>
              <div className="flex justify-end">
                <Withdraw />
              </div>
              <div className="mt-1 overflow-hidden">
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
