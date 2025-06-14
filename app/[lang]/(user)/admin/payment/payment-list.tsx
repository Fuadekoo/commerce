"use client";
import React, { useState } from "react";
import CustomTable from "@/components/custom-table";
import useAction from "@/hooks/useAction";
import { getPayment } from "@/actions/admin/payment";
import { Button } from "@heroui/react"; // Assuming you use HeroUI buttons, adjust if not
// import React from 'react'

function PaymentList() {
  return (
    <div>
      <h1>payment list</h1>
    </div>
  );
}

export default PaymentList;
