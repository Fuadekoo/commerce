"use client";
import React, { useState } from "react";
import CustomTable from "@/components/custom-table";
import useAction from "@/hooks/useAction";
import { getUser } from "@/actions/admin/user";
import { Button } from "@heroui/react"; // Assuming you use HeroUI buttons, adjust if not

// Define the type for a column, including the optional renderCell
interface ColumnDef {
  key: string;
  label: string;
  renderCell?: (item: any) => React.ReactNode;
}

// Placeholder functions for button actions - implement their actual logic
// These can remain outside the component if they don't need component-specific state
// beyond what's passed to them.
const handleAdd = (item: any) => {
  console.log("Add action for item ID:", item.id);
  console.log("Full item for Add:", item);
  alert(`Add action for user ID: ${item.id}, Username: ${item.username}`);
};

const handleDelete = (itemId: string | number) => {
  console.log("Delete item ID:", itemId);
  if (
    window.confirm(`Are you sure you want to delete item with ID ${itemId}?`)
  ) {
    alert(`Item with ID ${itemId} would be deleted.`);
  }
};

const handleView = (item: any) => {
  console.log("View item ID:", item.id);
  console.log("Full item for View:", item);
  alert(`Viewing details for user ID: ${item.id}, Username: ${item.username}`);
};

function CustomerPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [data, refresh, isLoading] = useAction(
    getUser,
    [true, () => {}], // Initial call and callback
    search,
    page,
    pageSize
  );

  // Define rows first, as columns definition might need it for index calculation
  const rows = (data?.data || []).map((user: any) => ({
    ...user,
    key: user.id, // Ensure 'key' is set to the actual unique ID for findIndex
    createdAt: user.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : "N/A",
  }));

  // Define columns inside the component to access 'page', 'pageSize', and 'rows'
  const columns: ColumnDef[] = [
    {
      key: "id", // This key is used to access item.id if no renderCell, but renderCell overrides display
      label: "#", // Changed label for sequential number
      renderCell: (item) => {
        // Find the index of the current item within the 'rows' array for the current page
        const rowIndexOnPage = rows.findIndex((r) => r.key === item.key);
        // Calculate the auto-incrementing number
        if (rowIndexOnPage !== -1) {
          return (page - 1) * pageSize + rowIndexOnPage + 1;
        }
        // Fallback, though item should always be found if rows is not empty
        return item.id; // Or some placeholder if preferred
      },
    },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "todayTasks", label: "Today Tasks" },
    { key: "totalTasks", label: "Total Tasks" },
    { key: "doneTasks", label: "Done Tasks" },
    { key: "balance", label: "Balance" },
    { key: "createdAt", label: "Joined Date" },
    { key: "status", label: "Status" },
    {
      key: "action",
      label: "Action",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            color="success"
            variant="flat"
            onPress={() => handleAdd(item)}
          >
            Add
          </Button>
          <Button
            size="sm"
            color="primary"
            variant="flat"
            onPress={() => handleView(item)}
          >
            View
          </Button>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            onPress={() => handleDelete(item.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading && !data?.data && page === 1) {
    // Show loading only on initial load or when data is truly empty
    return (
      <div className="flex justify-center items-center h-full">
        <div>Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4 lg:p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">
        Customer Management
      </h1>
      <div className="flex-grow">
        <CustomTable
          columns={columns}
          rows={rows}
          totalRows={data?.pagination?.totalRecords || 0}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setPage(1); // Reset to first page when page size changes
          }}
          searchValue={search}
          onSearch={(value) => {
            setSearch(value);
            setPage(1); // Reset to first page when search query changes
          }}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default CustomerPage;
