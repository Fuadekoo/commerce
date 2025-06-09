"use client";
import React, { useState } from "react";
import CustomTable from "@/components/custom-table";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "photo", label: "Photo" },
  { key: "date", label: "Date" },
  { key: "action", label: "Action" },
];

// Sample data
const sampleRows = [
  {
    id: "1",
    name: "John Doe",
    amount: "100.00",
    status: "Completed",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-01",
    action: "View Details",
  },
  {
    id: "2",
    name: "Jane Smith",
    amount: "200.00",
    status: "Pending",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-02",
    action: "View Details",
  },
  {
    id: "3",
    name: "Alice Johnson",
    amount: "150.00",
    status: "Failed",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-03",
    action: "View Details",
  },
  {
    id: "4",
    name: "Bob Brown",
    amount: "300.00",
    status: "Completed",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-04",
    action: "View Details",
  },
  {
    id: "5",
    name: "Charlie Davis",
    amount: "250.00",
    status: "Pending",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-05",
    action: "View Details",
  },
  {
    id: "6",
    name: "Eve White",
    amount: "180.00",
    status: "Failed",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-06",
    action: "View Details",
  },
  {
    id: "7",
    name: "Frank Green",
    amount: "220.00",
    status: "Completed",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-07",
    action: "View Details",
  },
  {
    id: "8",
    name: "Grace Black",
    amount: "130.00",
    status: "Pending",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-08",
    action: "View Details",
  },
  {
    id: "9",
    name: "Hank Blue",
    amount: "170.00",
    status: "Failed",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-09",
    action: "View Details",
  },
  {
    id: "10",
    name: "Ivy Yellow",
    amount: "90.00",
    status: "Completed",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-10",
    action: "View Details",
  },
  // Add more rows as needed
];

function Page() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Optionally filter sampleRows by search
  const filteredRows = sampleRows.filter(
    (row) =>
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.status.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic for sample data
  const paginatedRows = filteredRows.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-2">Payments</h1>
      <p className="text-gray-600 mb-6">
        Manage your payment methods and view transaction history.
      </p>
      <CustomTable
        columns={columns}
        rows={paginatedRows}
        totalRows={filteredRows.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        searchValue={search}
        onSearch={setSearch}
      />
    </div>
  );
}

export default Page;
