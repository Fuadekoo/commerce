"use client";
import React from "react";
import CustomTable from "@/components/custom-table";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "status", label: "Status" },
];

const rows = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
    status: "Inactive",
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "555-555-5555",
    status: "Active",
  },
];

function Page() {
  return (
    <div>
      <h1>Customer Management</h1>
      <p>Manage your customers and their information.</p>
      {/* <CustomTable columns={columns} rows={rows} /> */}
    </div>
  );
}

export default Page;
