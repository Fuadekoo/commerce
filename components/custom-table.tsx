"use client";
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/react";
import { X, Search } from "lucide-react"; // Import Search icon

interface CustomTableProps {
  rows: Array<
    Record<string, any> & { key?: string | number; id?: string | number }
  >;
  columns: Array<{ key: string; label: string }>;
  totalRows: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  searchValue: string;
  onSearch: (value: string) => void;
  isLoading?: boolean;
}

const PAGE_SIZES = [10, 20, 50, 100];

function CustomTable({
  rows,
  columns,
  totalRows,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearch,
  isLoading = false,
}: CustomTableProps) {
  const totalPages = Math.max(Math.ceil(totalRows / pageSize), 1);

  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setZoomedImageUrl(imageUrl);
  };

  const handleCloseZoom = () => {
    setZoomedImageUrl(null);
  };

  return (
    <div className="space-y-4">
      {/* Search and page size */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex items-center">
          {" "}
          {/* Wrapper for icon and input */}
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="border rounded px-3 py-2 pl-10 w-full sm:w-auto sm:min-w-[250px] text-sm" // Added pl-10 for padding left of icon
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>Show:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border rounded px-3 py-2"
            disabled={isLoading}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-md">
        <Table aria-label="Data table with dynamic content">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                className="bg-gray-100 p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={rows}
            emptyContent={
              !isLoading && rows.length === 0 ? "No data to display." : " "
            }
          >
            {(item) => (
              <TableRow
                key={item.key || item.id}
                className="hover:bg-gray-50 border-b last:border-b-0"
              >
                {(columnKey) => (
                  <TableCell className="p-3 text-sm text-gray-700">
                    {columnKey === "photo" &&
                    typeof item.photo === "string" &&
                    item.photo ? (
                      <img
                        src={`/api/filedata/${item.photo}`}
                        alt={`Proof for ${item.id || item.key || "entry"}`}
                        style={{
                          width: "100px",
                          height: "auto",
                          borderRadius: "4px",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleImageClick(`/api/filedata/${item.photo}`)
                        }
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (
                            parent &&
                            !parent.querySelector(".no-preview-text")
                          ) {
                            const errorText = document.createElement("span");
                            errorText.textContent = "No preview";
                            errorText.className =
                              "text-xs text-gray-400 no-preview-text";
                            parent.appendChild(errorText);
                          }
                        }}
                      />
                    ) : (
                      getKeyValue(item, columnKey)
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Loading indicator */}
      {isLoading && rows.length === 0 && (
        <div className="flex justify-center items-center p-6">
          <span className="text-gray-500">Loading data...</span>
        </div>
      )}

      {/* Pagination */}
      {totalRows > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 p-2 text-sm">
          <div>
            Showing{" "}
            <span className="font-medium">
              {rows.length > 0
                ? Math.min((page - 1) * pageSize + 1, totalRows)
                : 0}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(page * pageSize, totalRows)}
            </span>{" "}
            of <span className="font-medium">{totalRows}</span> results
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1 || isLoading}
                className="px-3 py-1.5 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || isLoading}
                className="px-3 py-1.5 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImageUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={handleCloseZoom}
        >
          <div
            className="relative bg-white p-2 rounded-lg shadow-xl max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomedImageUrl}
              alt="Zoomed proof"
              className="block max-w-full max-h-[calc(90vh-80px)] object-contain rounded"
            />
            <button
              onClick={handleCloseZoom}
              className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1.5 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close zoomed image"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomTable;
