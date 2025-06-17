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
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import { z } from "zod";
import { productSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
            // status: "success",
          });
          refreshProducts();
        } else {
          addToast({
            title: "Error",
            description:
              (response as any)?.error || "Failed to delete product.",
            // status: "error",
          });
        }
      },
    ]
  );

  const [createProductResponse, productAction, isLoadingCreate] = useAction(
    createProduct,
    [
      ,
      (response) => {
        if (response) {
          addToast({
            title: "Success",
            description: (response as any)?.message || "Product created.",
            // status: "success",
          });
          setShowModal(false);
          reset();
          refreshProducts();
        } else {
          addToast({
            title: "Error",
            description:
              (response as any)?.error || "Failed to create product.",
            // status: "error",
          });
        }
      },
    ]
  );

  const [updateProductResponse, updateProductAction, isLoadingUpdate] =
    useAction(updateProduct, [
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
            description:
              (response as any)?.error || "Failed to update product.",
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
    // Pre-fill form
    setValue("name", item.name);
    // setValue("description", item.description || "");
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
      await updateProductAction({ ...data, id: editProduct.id });
    } else {
      await productAction(data);
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
        loading={isLoadingProducts}
        pagination={{
          currentPage: productData?.pagination.currentPage || 1,
          totalPages: productData?.pagination.totalPages || 1,
          onPageChange: setPage,
        }}
      />
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditProduct(null);
        }}
      >
        <ModalHeader>
          {editProduct ? "Edit Product" : "Add Product"}
        </ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                label="Name"
                {...register("name")}
                // error={!!errors.name}
                // helperText={errors.name?.message}
              />
              {/* <Textarea
                label="Description"
                {...register("description")}
                // error={!!errors.description}
                // helperText={errors.description?.message}
              /> */}
              <Input
                label="Price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                // error={!!errors.price}
                // helperText={errors.price?.message}
              />
              <Input
                label="Stock"
                type="number"
                {...register("stock", { valueAsNumber: true })}
                // error={!!errors.stock}
                // helperText={errors.stock?.message}
              />
              <Input
                label="Order Number"
                type="number"
                {...register("orderNumber", { valueAsNumber: true })}
                // error={!!errors.orderNumber}
                // helperText={errors.orderNumber?.message}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              type="button"
              onPress={() => {
                setShowModal(false);
                setEditProduct(null);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={editProduct ? isLoadingUpdate : isLoadingCreate}
              disabled={editProduct ? isLoadingUpdate : isLoadingCreate}
            >
              {editProduct ? "Update" : "Add"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}

export default ProductList;
