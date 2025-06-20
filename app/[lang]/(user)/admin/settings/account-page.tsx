"use client";
import React, { useEffect, useState } from "react";
import useAction from "@/hooks/useAction";
import {
  addCompanyAccount,
  deleteCompanyAccount,
  getCompanyAccount,
  updateCompanyAccount,
} from "@/actions/admin/company";
import { Button, Input } from "@heroui/react";
import { companyAccountSchema } from "@/lib/zodSchema";
import { addToast } from "@heroui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

function AccountPage() {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  // Fetch all company accounts
  const [accounts, fetchAccounts, isGetting] = useAction(getCompanyAccount, [
    true,
    () => {},
  ]);

  const [, addAction, isAdding] = useAction(addCompanyAccount, [
    ,
    (res) => {
      addToast({
        title: res?.message ? "Added" : "Error",
        description: res?.message || "Add failed",
      });
      setShowModal(false);
      fetchAccounts();
    },
  ]);
  const [, updateAction, isUpdating] = useAction(updateCompanyAccount, [
    ,
    (res) => {
      addToast({
        title: res?.message ? "Updated" : "Error",
        description: res?.message || "Update failed",
      });
      setShowModal(false);
      fetchAccounts();
    },
  ]);
  const [, deleteAction, isDeleting] = useAction(deleteCompanyAccount, [
    ,
    (res) => {
      addToast({
        title: res?.message ? "Deleted" : "Error",
        description: res?.message || "Delete failed",
      });
      fetchAccounts();
    },
  ]);

  const { register, handleSubmit, reset } = useForm<
    z.infer<typeof companyAccountSchema>
  >({
    resolver: zodResolver(companyAccountSchema),
    defaultValues: {
      name: "",
      account: "",
    },
  });

  // Prefill form for update
  useEffect(() => {
    if (showModal && editMode && selectedAccount) {
      reset({
        name: selectedAccount.name || "",
        account: selectedAccount.account || "",
      });
    } else if (showModal && !editMode) {
      reset({
        name: "",
        account: "",
      });
    }
  }, [showModal, editMode, selectedAccount, reset]);

  const openAddModal = () => {
    setEditMode(false);
    setSelectedAccount(null);
    setShowModal(true);
  };

  const openEditModal = (account: string) => {
    setEditMode(true);
    setSelectedAccount(account);
    setShowModal(true);
  };

  const onSubmit = (data: z.infer<typeof companyAccountSchema>) => {
    if (editMode && selectedAccount) {
      updateAction(selectedAccount.id, { ...data });
    } else {
      addAction(data);
    }
  };

  const handleDelete = (id: string) => {
    deleteAction(id);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Company Accounts
      </h1>
      {isGetting ? (
        <div className="text-center text-gray-400 py-10">Loading...</div>
      ) : accounts && accounts.length > 0 ? (
        accounts.map((acc) => (
          <div key={acc.id} className="border rounded-lg p-4 bg-gray-50 mb-4">
            <div className="mb-2">
              <span className="font-semibold">Name:</span> {acc.name}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Account:</span> {acc.account}
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                color="primary"
                onClick={() => openEditModal(acc.id)}
                disabled={isUpdating || isDeleting}
              >
                {isUpdating && selectedAccount?.id === acc.id
                  ? "Updating..."
                  : "Update"}
              </Button>
              <Button
                color="danger"
                variant="flat"
                onClick={() => handleDelete(acc.id)}
                // loading={isDeleting && deleteResponse?.id === acc.id}
                disabled={isUpdating || isDeleting}
              >
                Delete
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400 py-10">
          No company account found.
        </div>
      )}
      <Button color="primary" onClick={openAddModal} disabled={isAdding}>
        Add Company Account
      </Button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {editMode ? "Update Company Account" : "Add Company Account"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Name"
                {...register("name")}
                className="mb-3"
                autoFocus
              />
              <Input
                label="Account"
                {...register("account")}
                className="mb-3"
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="flat"
                  onClick={() => setShowModal(false)}
                  disabled={isAdding || isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  // loading={isAdding || isUpdating}
                  disabled={isAdding || isUpdating}
                >
                  {editMode ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountPage;
