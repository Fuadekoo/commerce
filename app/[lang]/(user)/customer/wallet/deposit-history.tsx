"use client";
import useAction from "@/hooks/useAction";
import { DepositHistory } from "@/actions/user/wallet";
import React, { useState } from "react";
import CustomTable from "@/components/custom-table";

// interface DepositHistoryItem {
//   id: string;
//   amount: number;
//   photo: string;
//   createdAt: string;
//   status: string;
// }

// interface PaginationInfo {
//   currentPage: number;
//   totalPages: number;
//   itemsPerPage: number;
//   totalRecords: number;
//   hasNextPage: boolean;
//   hasPreviousPage: boolean;
// }

// interface DepositHistoryResponse {
//   data: DepositHistoryItem[];
//   pagination: PaginationInfo;
// }

const columns = [
  { key: "id", label: "Transaction ID" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Created At" },
];

function DepositHistoryPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const [data, ,] = useAction(
    DepositHistory,
    [true, () => {}],
    search,
    page,
    pageSize
  );

  return (
    <div className="p-2 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Deposit History</h1>
      <CustomTable
        columns={columns}
        rows={(data?.data || []).map((item) => ({
          ...item,
          key: String(item.id),
          id: String(item.id),
          amount: item.amount != null ? String(item.amount) : "",
          status: item.status ?? "",
          createdAt: item.createdAt ?? "",
          // photo: item.photo ?? "", // Only if needed by your table
        }))}
        totalRows={data?.pagination.totalRecords || 0}
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

export default DepositHistoryPage;
