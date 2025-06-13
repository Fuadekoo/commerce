"use client";
import React, { useState } from "react";
import CustomTable from "@/components/custom-table";
import useAction from "@/hooks/useAction";
import { addToast } from "@heroui/toast";
import { WithdrawalHistorys } from "@/actions/user/wallet"; // Adjust the import path as necessary

const columns = [
  { key: "id", label: "ID" },
  { key: "createdAt", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
];

function Page() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Fetch withdrawal history (replace with your own data fetching logic if needed)
  const [withdrawalHistory, refresh, isLoading] = useAction(
    WithdrawalHistorys,
    [true, () => {}],
    search,
    page,
    pageSize
  );

  return (
    <div className="p-2 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
      <p>Manage your customers and their information.</p>
      <CustomTable
        columns={columns}
        rows={(withdrawalHistory?.data || []).map((row) => ({
          ...row,
          key: row.id,
        }))}
        totalRows={withdrawalHistory?.pagination?.totalRecords || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        searchValue={search}
        onSearch={setSearch}
        // loading={isLoading}
      />
    </div>
  );
}

export default Page;
