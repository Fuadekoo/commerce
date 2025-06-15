"use client";
import React, { useState } from "react";
import useAction from "@/hooks/useAction";
import {
  getProduct,
  deleteProduct,
  createProduct,
  updateProduct,
} from "@/actions/admin/product";
import CustomTable from "@/components/custom-table";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/toast";

interface ProductItem {
  id: string | number;
  key?: string | number;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  orderNumber?: number;
  // image?: string;
  createdAt?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalRecords: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

interface GetProductResponse {
  data: ProductItem[];
  pagination: PaginationInfo;
}

interface ColumnDef {
  key: string;
  label: string;
  renderCell?: (item: ProductItem) => React.ReactNode;
}

const handleEditProduct = (item: ProductItem) => {
  addToast({
    title: "Edit Action",
    description: `Editing product ID: ${item.id}`,
  });
};

function ProductList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [productData, refreshProducts, isLoadingProducts] = useAction(
    getProduct,
    [true, () => {}],
    search,
    page,
    pageSize
  );

  const [deleteResponse, executeDeleteProduct, isLoadingDelete] = useAction(
    deleteProduct,
    [
      ,
      // Don't execute immediately
      (response) => {
        if (response) {
          addToast({
            title: "Success",
            description: (response as any)?.message || "Product deleted.",
          });
          refreshProducts();
        } else {
          addToast({
            title: "Error",
            description:
              (response as any)?.error || "Failed to delete product.",
          });
        }
      },
    ]
  );

  const [createProductResponse, productAction, isLoadingCreate] = useAction(
    createProduct,
    [, () => {}]
  );

  const [updateProductResponse, updateProductAction, isLoadingUpdate] =
    useAction(updateProduct, [, () => {}]);

  const handleDeleteProduct = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await executeDeleteProduct(id.toString());
    }
  };

  const rows = (productData?.data || []).map((product) => ({
    ...product,
    key: product.id,
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
        return item.id.toString().slice(0, 5) + "...";
      },
    },
    {
      key: "name",
      label: "Name",
      renderCell: (item) => item.name,
    },
    {
      key: "price",
      label: "Price",
      renderCell: (item) => `$${item.price.toFixed(2)}`,
    },
    {
      key: "stock",
      label: "Stock",
      renderCell: (item) => item.stock ?? "N/A",
    },
    {
      key: "orderNumber",
      label: "Order No.",
      renderCell: (item) => item.orderNumber ?? "N/A",
    },
    {
      key: "createdAt",
      label: "Created At",
      renderCell: (item) =>
        item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
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
            onPress={() => handleEditProduct(item)}
            disabled={isLoadingDelete}
          >
            Edit
          </Button>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            onPress={() => handleDeleteProduct(item.id)}
            disabled={isLoadingDelete}
          >
            {isLoadingDelete ? "Deleting..." : "Delete"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <Button
          color="primary"
          onPress={() =>
            addToast({
              title: "Add Product",
              description: "Add product action triggered.",
            })
          }
        >
          Add Product
        </Button>
      </div>
      <CustomTable
        columns={columns}
        rows={rows}
        loading={isLoadingProducts}
        pagination={{
          currentPage: productData?.pagination.currentPage || 1,
          totalPages: productData?.pagination.totalPages || 1,
          onPageChange: setPage,
        }}
      />
    </div>
  );
}

export default ProductList;
