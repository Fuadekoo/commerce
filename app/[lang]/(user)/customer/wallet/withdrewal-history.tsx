"use client";
import React, { useState } from "react";
import CustomTable from "../../../../../components/custom-table";
import useAction from "@/hooks/useAction";
import { addToast } from "@heroui/toast";
import { WithdrawalHistorys } from "@/actions/user/wallet"; // Adjust the import path as necessary
import { z } from "zod";

// Define table columns
const columns = [
  { key: "id", label: "ID" },
  { key: "createdAt", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
];

function WithdrawalHistory() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [withdrawalHistory, refresh, isLoading] = useAction(
    WithdrawalHistorys,
    [true, () => {}],
    search,
    page,
    pageSize
  );

  // Optionally filter by status or date
  // const filteredRows = withdrawalHistory.filter(
  //   (row) =>
  //     row.status.toLowerCase().includes(search.toLowerCase()) ||
  //     row.date.includes(search)
  // );

  // const paginatedRows = filteredRows.slice(
  //   (page - 1) * pageSize,
  //   page * pageSize
  // );

  return (
    <div className="p-2 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Withdrawal History</h2>
      <CustomTable
        columns={columns}
        rows={(withdrawalHistory?.data || []).map((row) => ({
          ...row,
          key: row.id,
        }))}
        totalRows={withdrawalHistory?.pagination.totalRecords || 0}
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
