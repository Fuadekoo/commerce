"use client";
import React, { useState } from "react";
import CustomTable from "../../../../../components/custom-table";

// Example withdrawal data
const withdrawalHistory = [
  {
    id: 1,
    date: "2024-06-01",
    amount: 100,
    status: "Completed",
  },
  {
    id: 2,
    date: "2024-06-05",
    amount: 50,
    status: "Pending",
  },
];

// Define table columns
const columns = [
  { key: "id", label: "ID" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
];

function WithdrawalHistory() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Optionally filter by status or date
  const filteredRows = withdrawalHistory.filter(
    (row) =>
      row.status.toLowerCase().includes(search.toLowerCase()) ||
      row.date.includes(search)
  );

  const paginatedRows = filteredRows.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4">Withdrawal History</h2>
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

export default WithdrawalHistory;
