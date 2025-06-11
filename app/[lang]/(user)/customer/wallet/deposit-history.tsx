"use client";
import React, { useState } from "react";
import CustomTable from "@/components/custom-table";

const columns = [
  { key: "id", label: "ID" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "photo", label: "Photo" },
  { key: "date", label: "Date" },
];

const sampleRows = [
  {
    id: "1",
    amount: "100.00",
    status: "Completed",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-01",
  },
  {
    id: "2",
    amount: "200.00",
    status: "Pending",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-02",
  },
  {
    id: "3",
    amount: "150.00",
    status: "Failed",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-03",
  },
  {
    id: "4",
    amount: "300.00",
    status: "Completed",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-04",
  },
  {
    id: "5",
    amount: "250.00",
    status: "Pending",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-05",
  },
  {
    id: "6",
    amount: "180.00",
    status: "Failed",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-06",
  },
  {
    id: "7",
    amount: "220.00",
    status: "Completed",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-07",
  },
  {
    id: "8",
    amount: "130.00",
    status: "Pending",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-08",
  },
  {
    id: "9",
    amount: "170.00",
    status: "Failed",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-09",
  },
  {
    id: "10",
    amount: "90.00",
    status: "Completed",
    photo: "https://via.placeholder.com/50",
    date: "2023-10-10",
  },
];

function DepositHistory() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const filteredRows = sampleRows.filter((row) =>
    row.status.toLowerCase().includes(search.toLowerCase())
  );

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

export default DepositHistory;
