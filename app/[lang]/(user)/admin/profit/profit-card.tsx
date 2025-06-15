"use client";
import React, { useState } from "react";
import { getProfitCards } from "@/actions/admin/profitCards";
import useAction from "@/hooks/useAction";
import CustomTable from "@/components/custom-table";
import { Button } from "@heroui/react"; // Import Button
import { addToast } from "@heroui/toast"; // For potential toast messages

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

// Placeholder for delete action
const handleDeleteProfitCard = async (id: string | number, refreshCallback: () => void) => {
  console.log("Attempting to delete profit card ID:", id);
  // TODO: Implement actual delete logic using useAction
  // Example:
  // const [deleteResponse, deleteAction, isLoadingDelete] = useAction(deleteProfitCardAction, [, (response) => { ... refresh(); ... }]);
  // await deleteAction(id);
  addToast({ title: "Delete Action", description: `Profit card ID: ${id} would be deleted. Implement actual logic.`, status: "info" });
  refreshCallback(); // Call refresh for consistency if the action is mocked or successful
};

// Placeholder for approve action
const handleApproveProfitCard = async (id: string | number, refreshCallback: () => void) => {
  console.log("Attempting to approve profit card ID:", id);
  // TODO: Implement actual approve logic using useAction
  // Example:
  // const [approveResponse, approveAction, isLoadingApprove] = useAction(approveProfitCardAction, [, (response) => { ... refresh(); ... }]);
  // await approveAction(id);
  addToast({ title: "Approve Action", description: `Profit card ID: ${id} would be approved. Implement actual logic.`, status: "info" });
  refreshCallback(); // Call refresh for consistency
};

function ProfitCard() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [apiResponse, refresh, isLoading] = useAction(
    getProfitCards,
    [true, () => {}],
    search,
    page,
    pageSize
  );

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
            color="warning" // Or "danger" if more appropriate for delete
            variant="flat"
            onPress={() => handleDeleteProfitCard(item.id, refresh)}
            // TODO: Add isLoading state from a useAction hook for delete
          >
            Delete
          </Button>
          {/* Conditionally show Approve button, e.g., if status is PENDING */}
          {item.status === "PENDING" && ( // Adjust "PENDING" to your actual status value
            <Button
              size="sm"
              color="success"
              variant="flat"
              onPress={() => handleApproveProfitCard(item.id, refresh)}
              // TODO: Add isLoading state from a useAction hook for approve
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
