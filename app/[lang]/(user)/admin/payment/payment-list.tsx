"use client";
import React, { useState } from "react";
import CustomTable from "@/components/custom-table";
import useAction from "@/hooks/useAction";
import { getPayment } from "@/actions/admin/payment";
// Make sure to import aproofDeposit if you implement the approval logic
// import { aproofDeposit } from "@/actions/admin/payment";
import { Button } from "@heroui/react";

// Define the structure of a single payment item based on getPayment action
interface PaymentItem {
  id: string | number;
  key?: string | number;
  amount: number;
  photo?: string;
  status: string;
  createdAt: string;
  user?: {
    username: string;
    email?: string;
    phone?: string;
  };
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalRecords: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

const columns =[
  { key: "id", label: "ID" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "photo", label: "Proof" }, // Assuming CustomTable handles 'photo' key for image display
  { key: "createdAt", label: "Created At" },
  { key: "user.username", label: "User" }, // Nested user property
]

interface GetPaymentResponse {
  data: PaymentItem[];
  pagination: PaginationInfo;
}

interface ColumnDef {
  key: string;
  label: string;
  renderCell?: (item: PaymentItem) => React.ReactNode;
}

const handleViewPayment = (item: PaymentItem) => {
  console.log("View payment:", item);
  alert(`Viewing payment ID: ${item.id}, Amount: ${item.amount}`);
  // Implement actual view logic (e.g., open modal)
};

const handleApprovePayment = async (
  id: string | number,
  refreshCallback: () => void
) => {
  console.log("Attempting to approve payment ID:", id);
  // try {
  //   // const result = await aproofDeposit(id.toString()); // Ensure aproofDeposit is imported
  //   // alert(result.message || "Approval action completed.");
  //   // refreshCallback(); // Refresh the table data
  // } catch (error) {
  //   // console.error("Error approving deposit:", error);
  //   // alert("Failed to approve deposit.");
  // }
  alert(
    `Payment ID: ${id} would be approved. Implement actual logic and uncomment above.`
  );
  refreshCallback(); // Call refresh for consistency
};

function PaymentListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Corrected useAction usage
  const [data, refresh, isLoading] = useAction(
    getPayment,
    [true, () => {}],
    search,
    page,
    pageSize
  );

  const rows = (data?.data || []).map((payment) => ({
    ...payment,
    key: payment.id,
  }));

  const columns = [
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
      key: "user.username",
      label: "User",
      renderCell: (item) => item.user?.username || "N/A",
    },
    {
      key: "amount",
      label: "Amount",
      renderCell: (item) => `$${item.amount.toFixed(2)}`, // Amount is already a number
    },
    { key: "status", label: "Status" },
    { key: "photo", label: "Proof" }, // Assuming CustomTable handles 'photo' key for image display
    {
      key: "createdAt",
      label: "Date",
      renderCell: (item) => new Date(item.createdAt).toLocaleDateString(), // createdAt is ISO string
    },
    {
      key: "actions",
      label: "Actions",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            color="primary"
            variant="flat"
            onPress={() => handleViewPayment(item)}
          >
            View
          </Button>
          {item.status === "PENDING" && ( // Adjust "PENDING" to your actual status value
            <Button
              size="sm"
              color="success"
              variant="flat"
              onPress={() => handleApprovePayment(item.id, refresh)}
            >
              Approve
            </Button>
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
