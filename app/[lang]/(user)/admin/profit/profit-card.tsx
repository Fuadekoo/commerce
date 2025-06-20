"use client";
import React, { useState } from "react";
import {
  getProfitCards,
  addProfit,
  approveProfit,
  deleteProfit,
} from "@/actions/admin/profitCards";
import useAction from "@/hooks/useAction";
import CustomTable from "@/components/custom-table";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/toast";

interface ProfitCardItem {
  id: string | number;
  key?: string | number;
  orderNumber: number;
  profit: number;
  priceDifference: number;
  createdAt: string;
  status?: string;
  user?: {
    username: string;
  };
}

interface ColumnDef {
  key: string;
  label: string;
  renderCell?: (item: ProfitCardItem) => React.ReactNode;
}

function ProfitCard() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loadingDeleteId, setLoadingDeleteId] = useState<
    string | number | null
  >(null);
  const [loadingApproveId, setLoadingApproveId] = useState<
    string | number | null
  >(null);

  const [apiResponse, refresh, isLoading] = useAction(
    getProfitCards,
    [true, () => {}],
    search,
    page,
    pageSize
  );

  // const [addresponse, addAction, isLoadingCreate] = useAction(addProfit, [
  //   ,
  //   () => {},
  // ]);

  const [, approveAction] = useAction(approveProfit, [
    ,
    (response) => {
      setLoadingApproveId(null);
      if (response) {
        addToast({
          title: "Success",
          description: response?.message || "Profit approved successfully.",
          // status: "success",
        });
        refresh();
      } else {
        addToast({
          title: "Error",
          description: response || "Failed to approve profit.",
          // status: "error",
        });
      }
    },
  ]);

  const [deleteResponse, deleteAction] = useAction(deleteProfit, [
    ,
    (response) => {
      setLoadingDeleteId(null);
      if (response) {
        addToast({
          title: "Success",
          description: response?.message || "Profit deleted successfully.",
          // status: "success",
        });
        refresh();
      } else {
        addToast({
          title: "Error",
          description: response || "Failed to delete profit.",
          // status: "error",
        });
      }
    },
  ]);

  const rows = (apiResponse?.data || []).map((card: any) => ({
    ...card,
    createdAt:
      typeof card.createdAt === "string"
        ? card.createdAt
        : card.createdAt?.toISOString?.() ?? "",
    key: card.id,
  }));

  const columns: ColumnDef[] = [
    {
      key: "autoId",
      label: "#",
      renderCell: (item) => {
        const rowIndexOnPage = rows.findIndex((r) => r.id === item.id);
        return rowIndexOnPage !== -1
          ? (page - 1) * pageSize + rowIndexOnPage + 1
          : item.id;
      },
    },
    {
      key: "user.username",
      label: "User",
      renderCell: (item) => item.user?.username || "N/A",
    },
    { key: "orderNumber", label: "Order Number" },
    {
      key: "profit",
      label: "Profit",
      renderCell: (item) => `$${Number(item.profit).toFixed(2)}`,
    },
    {
      key: "priceDifference",
      label: "Price Difference",
      renderCell: (item) => `$${Number(item.priceDifference).toFixed(2)}`,
    },

    {
      key: "createdAt",
      label: "Date",
      renderCell: (item) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      renderCell: (item) => item.status || "N/A",
    },
    {
      key: "action",
      label: "Action",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            color="warning"
            variant="flat"
            onPress={async () => {
              setLoadingDeleteId(item.id);
              await deleteAction(String(item.id));
            }}
            isLoading={loadingDeleteId === item.id}
            disabled={loadingDeleteId === item.id}
          >
            Delete
          </Button>
          {item.status === "PENDING" && (
            <Button
              size="sm"
              color="success"
              variant="flat"
              onPress={async () => {
                setLoadingApproveId(item.id);
                await approveAction(String(item.id));
              }}
              isLoading={loadingApproveId === item.id}
              disabled={loadingApproveId === item.id}
            >
              Approve
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading && !apiResponse?.data && page === 1) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        Loading profit cards...
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4 lg:p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">
        Profit Card Records
      </h1>
      <div className="flex-grow">
        <CustomTable
          columns={columns}
          rows={rows}
          totalRows={apiResponse?.pagination?.totalRecords || 0}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setPage(1);
          }}
          searchValue={search}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default ProfitCard;
