"use client";
import React, { useState } from "react";
import useAction from "@/hooks/useAction";
import {
  getContact,
  approveContact,
  rejectContact,
} from "@/actions/admin/contact";
import CustomTable from "@/components/custom-table";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { MessageCircleCode } from "lucide-react";
import Link from "next/link";

interface ColumnDef {
  key: string;
  label: string;
  renderCell?: (
    item: Record<string, string> & {
      key?: string | number;
      id?: string | number;
    }
  ) => React.ReactNode;
}

function SupportPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [data, refresh, isLoading] = useAction(
    getContact,
    [true, () => {}],
    search,
    page,
    pageSize
  );

  const [, approveContactAction, approveLoading] = useAction(approveContact, [
    ,
    (response) => {
      if (response && response.message) {
        addToast({
          title: "Approve Contact",
          description: response.message,
        });
      } else {
        addToast({
          title: "Approve Contact",
          description: "Contact approved successfully!",
        });
      }
      refresh();
    },
  ]);

  const [, rejectContactAction, rejectLoading] = useAction(rejectContact, [
    ,
    (response) => {
      if (response && response.message) {
        addToast({
          title: "Reject Contact",
          description: response.message,
        });
      } else {
        addToast({
          title: "Reject Contact",
          description: "Contact rejected successfully!",
        });
      }
      refresh();
    },
  ]);

  const rows = (data?.data || []).map((item: any) => ({
    ...item,
    key: item.id,
    createdAt: item.createdAt
      ? new Date(item.createdAt).toLocaleString()
      : "N/A",
  }));

  const columns: ColumnDef[] = [
    { key: "username", label: "Username" },
    { key: "phone", label: "Phone" },
    { key: "description", label: "Description" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created At" },
    {
      key: "actions",
      label: "Actions",
      renderCell: (item) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            color="success"
            variant="flat"
            onPress={() => {
              if (typeof item.id === "string") {
                approveContactAction(item.id);
              }
            }}
            disabled={approveLoading || item.status === "APPROVED"}
          >
            Approve
          </Button>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            onPress={() => {
              if (typeof item.id === "string") {
                rejectContactAction(item.id);
              }
            }}
            disabled={rejectLoading || item.status === "REJECTED"}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">
        Customer Support
      </h1>
      <div className="flex justify-end mb-4">
        <Link href="/en/admin/chat">
          <Button as="span" color="primary" className="flex items-center">
            <MessageCircleCode className="mr-2" />
            Support chat
          </Button>
        </Link>
      </div>
      <CustomTable
        columns={columns}
        rows={rows}
        totalRows={data?.pagination?.totalRecords || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        searchValue={search}
        onSearch={setSearch}
        isLoading={isLoading}
      />
    </div>
  );
}

export default SupportPage;
