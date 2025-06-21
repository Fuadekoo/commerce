"use client";
import React, { useState } from "react";
import CustomTable from "@/components/custom-table";
import useAction from "@/hooks/useAction";
import { Button } from "@heroui/react";
import {
  getPayment,
  aProofDeposit,
  rejectDeposit,
} from "@/actions/admin/payment"; // Assuming you have an action for approving deposits
import { addToast } from "@heroui/toast";
// Remove PaymentItem interface and update ColumnDef and columns to use Record<string, string>
interface ColumnDef {
  key: string;
  label: string;
  renderCell?: (item: Record<string, string>) => React.ReactNode;
}

function PaymentListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [processingApproveId, setProcessingApproveId] = useState<
    string | number | null
  >(null);
  const [processingRejectId, setProcessingRejectId] = useState<
    string | number | null
  >(null);

  // Corrected useAction usage
  const [data, refresh, isLoading] = useAction(
    getPayment,
    [true, () => {}],
    search,
    page,
    pageSize
  );

  const [, proofAction, isLoadingProof] = useAction(aProofDeposit, [
    ,
    // Initial data or config, can be null or an empty object if not needed
    (response) => {
      setProcessingApproveId(null); // Clear processing ID
      refresh(); // Refresh data after action execution
      // Callback function after action execution
      if (response) {
        addToast({
          title: "Approve Payment",
          description: response.message,
          // status: response.error ? "error" : "success",
        });
        // The refresh() call was moved up, no need for this conditional refresh
        // if (!response.error) { // Check for error before refreshing
        //   refresh(); // Refresh data on success
        // }
      } else {
        addToast({
          title: "Approve Payment",
          description: "An unexpected error occurred.",
          // status: "error",
        });
      }
    },
  ]);

  const [, rejectAction, isLoadingReject] = useAction(rejectDeposit, [
    ,
    // Initial data or config
    (response) => {
      setProcessingRejectId(null); // Clear processing ID
      refresh(); // Refresh data after action execution
      // Callback function after action execution
      if (response) {
        addToast({
          title: "Reject Payment",
          description: response.message,
          // status: response.error ? "error" : "success",
        });
        // The refresh() call was moved up, no need for this conditional refresh
        // if (!response.error) { // Check for error before refreshing
        //   refresh(); // Refresh data on success
        // }
      } else {
        addToast({
          title: "Reject Payment",
          description: "An unexpected error occurred.",
          // status: "error",
        });
      }
    },
  ]);

  // Convert all row fields to string for CustomTable compatibility
  const rows = (data?.data || []).map((payment) => ({
    key: String(payment.id),
    id: String(payment.id),
    amount: payment.amount != null ? String(payment.amount) : "",
    createdAt: payment.createdAt ?? "",
    status: payment.status ?? "",
    photo: payment.photo ?? "",
    user: payment.user?.username ?? "N/A",
  }));

  const columns: ColumnDef[] = [
    {
      key: "autoId",
      label: "#",
      renderCell: (item) => {
        const rowIndexOnPage = rows.findIndex((r) => r.id === item.id);
        if (rowIndexOnPage !== -1) {
          return (page - 1) * pageSize + rowIndexOnPage + 1;
        }
        return item.id;
      },
    },
    {
      key: "user",
      label: "User",
      renderCell: (item) => item.user || "N/A",
    },
    {
      key: "amount",
      label: "Amount",
      renderCell: (item) => `$${Number(item.amount).toFixed(2)}`,
    },
    { key: "status", label: "Status" },
    { key: "photo", label: "Proof" },
    {
      key: "createdAt",
      label: "Date",
      renderCell: (item) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          {item.status === "PENDING" && (
            <>
              <Button
                size="sm"
                color="success"
                variant="flat"
                onPress={() => {
                  setProcessingApproveId(item.id);
                  proofAction(String(item.id));
                }}
                isLoading={isLoadingProof && processingApproveId === item.id}
              >
                Approve
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="flat"
                onPress={() => {
                  setProcessingRejectId(item.id);
                  rejectAction(String(item.id));
                }}
                isLoading={isLoadingReject && processingRejectId === item.id}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  // Handle loading state
  if (isLoading && !data?.data && page === 1) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        <div>Loading payments...</div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4 lg:p-6 h-full flex flex-col overflow-hidden">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">
        Payment Records
      </h1>
      <div className="flex-grow overflow-auto">
        <CustomTable
          columns={columns}
          rows={rows}
          totalRows={data?.pagination?.totalRecords || 0} // Corrected: Access totalRecords from pagination
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
            setPage(1); // Backend also resets page to 1 on search
          }}
          isLoading={isLoading} // Pass isLoading to CustomTable for its own indicators
        />
      </div>
    </div>
  );
}

export default PaymentListPage;
