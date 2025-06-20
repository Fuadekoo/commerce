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
import { z } from "zod";
import { productSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

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

// interface PaginationInfo {
//   currentPage: number;
//   totalPages: number;
//   itemsPerPage: number;
//   totalRecords: number;
//   hasNextPage?: boolean;
//   hasPreviousPage?: boolean;
// }

// interface GetProductResponse {
//   data: ProductItem[];
//   pagination: PaginationInfo;
// }

interface ColumnDef {
  key: string;
  label: string;
  renderCell?: (item: ProductItem) => React.ReactNode;
}

function ProductList() {
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductItem | null>(null);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
  });
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

  const [, executeDeleteProduct, isLoadingDelete] = useAction(deleteProduct, [
    ,
    (response) => {
      if (response) {
        addToast({
          title: "Success",
          description: response?.message || "Product deleted.",
          // status: "success",
        });
        refreshProducts();
      } else {
        addToast({
          title: "Error",
          description: response || "Failed to delete product.",
          // status: "error",
        });
      }
    },
  ]);

  const [, productAction, isLoadingCreate] = useAction(createProduct, [
    ,
    (response) => {
      if (response) {
        addToast({
          title: "Success",
          description: response?.message || "Product created.",
          // status: "success",
        });
        setShowModal(false);
        reset();
        refreshProducts();
      } else {
        addToast({
          title: "Error",
          description: response || "Failed to create product.",
          // status: "error",
        });
      }
    },
  ]);

  const [, updateProductAction, isLoadingUpdate] = useAction(updateProduct, [
    ,
    (response) => {
      if (response) {
        addToast({
          title: "Success",
          description: response?.message || "Product updated.",
          // status: "success",
        });
        setShowModal(false);
        setEditProduct(null);
        reset();
        refreshProducts();
      } else {
        addToast({
          title: "Error",
          description: response || "Failed to update product.",
          // status: "error",
        });
      }
    },
  ]);

  const handleDeleteProduct = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await executeDeleteProduct(id.toString());
    }
  };

  const handleEditProduct = (item: ProductItem) => {
    setEditProduct(item);
    setShowModal(true);
    setValue("name", item.name);
    setValue("price", item.price);
    setValue("stock", item.stock ?? 0);
    setValue("orderNumber", item.orderNumber ?? 0);
  };

  const handleAddProduct = () => {
    setEditProduct(null);
    reset();
    setShowModal(true);
  };

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    if (editProduct) {
      updateProductAction(editProduct.id.toString(), data);
    } else {
      productAction(data);
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
        <Button color="primary" onPress={handleAddProduct}>
          Add Product
        </Button>
      </div>
      <CustomTable
        columns={columns}
        rows={rows}
        totalRows={productData?.pagination.totalRecords || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        searchValue={search}
        onSearch={setSearch}
        isLoading={isLoadingProducts}
      />
      {/* Custom Modal for Add/Edit Product */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editProduct ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <input
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Name"
                  {...register("name")}
                  disabled={isLoadingCreate || isLoadingUpdate}
                />
                {errors.name && (
                  <span className="text-red-500 text-xs">
                    {errors.name.message}
                  </span>
                )}

                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Price"
                  {...register("price", { valueAsNumber: true })}
                  disabled={isLoadingCreate || isLoadingUpdate}
                />
                {errors.price && (
                  <span className="text-red-500 text-xs">
                    {errors.price.message}
                  </span>
                )}
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Stock"
                  {...register("stock", { valueAsNumber: true })}
                  disabled={isLoadingCreate || isLoadingUpdate}
                />
                {errors.stock && (
                  <span className="text-red-500 text-xs">
                    {errors.stock.message}
                  </span>
                )}
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Order Number"
                  {...register("orderNumber", { valueAsNumber: true })}
                  disabled={isLoadingCreate || isLoadingUpdate}
                />
                {errors.orderNumber && (
                  <span className="text-red-500 text-xs">
                    {errors.orderNumber.message}
                  </span>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="ghost"
                  type="button"
                  onPress={() => {
                    setShowModal(false);
                    setEditProduct(null);
                    reset();
                  }}
                  disabled={isLoadingCreate || isLoadingUpdate}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={editProduct ? isLoadingUpdate : isLoadingCreate}
                  disabled={editProduct ? isLoadingUpdate : isLoadingCreate}
                >
                  {(editProduct ? isLoadingUpdate : isLoadingCreate) ? (
                    <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                  ) : null}
                  {editProduct ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
