import React, { useState, useEffect } from "react";
import CustomTable from "@/components/custom-table";
import useAction from "@/hooks/useAction";
import {
  getUser,
  addRemarksUser,
  setTask,
  addprofitCard,
  resetPassword,
  resetTransactionPassword,
  blockUser,
  unblockUser,
  updateBalance,
} from "@/actions/admin/user";
import { Lock, Unlock } from "lucide-react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { addToast } from "@heroui/toast";

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

function CustomerPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal States
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [currentRemarkItemId, setCurrentRemarkItemId] = useState<string | null>(
    null
  );
  const [remarkText, setRemarkText] = useState("");

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [currentOrderItemId, setCurrentOrderItemId] = useState<string | null>(
    null
  );
  const [orderNumberInput, setOrderNumberInput] = useState("");

  const [isProfitModalOpen, setIsProfitModalOpen] = useState(false);
  const [currentProfitItemId, setCurrentProfitItemId] = useState<string | null>(
    null
  );
  const [profitOrderNumberInput, setProfitOrderNumberInput] = useState("");
  const [profitAmountInput, setProfitAmountInput] = useState("");
  const [priceDifferenceInput, setPriceDifferenceInput] = useState("");

  const [, setIsAnyModalOpen] = useState(false);

  // Balance modal state
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [currentBalanceItemId, setCurrentBalanceItemId] = useState<
    string | null
  >(null);
  const [balanceInput, setBalanceInput] = useState("");

  useEffect(() => {
    setIsAnyModalOpen(
      isRemarkModalOpen ||
        isOrderModalOpen ||
        isProfitModalOpen ||
        isBalanceModalOpen
    );
  }, [
    isRemarkModalOpen,
    isOrderModalOpen,
    isProfitModalOpen,
    isBalanceModalOpen,
  ]);

  const [data, refresh, isLoading] = useAction(
    getUser,
    [true, () => {}],
    search,
    page,
    pageSize
  );

  const [, executeBlockUser, isLoadingBlock] = useAction(blockUser, [
    ,
    (response) => {
      if (response) {
        addToast({
          title: "Block User",
          description: response.message,
        });
      } else {
        addToast({
          description: "User status updated.",
        });
      }
      if (response) {
        refresh();
      }
    },
  ]);

  const [, executeUnblockUser, isLoadingUnblock] = useAction(unblockUser, [
    ,
    (response) => {
      if (response) {
        addToast({
          title: "Unblock User",
          description: response.message,
        });
      } else {
        addToast({
          title: "Unblock User",
          description: "User status updated.",
        });
      }
      if (response) {
        refresh();
      }
    },
  ]);

  const [, executeResetPassword, isLoadingResetPassword] = useAction(
    resetPassword,
    [
      ,
      (response) => {
        if (response) {
          addToast({
            title: "Reset Password",
            description: response.message,
          });
        } else {
          addToast({
            title: "Reset Password",
            description: "Password reset successfully!",
          });
        }
        refresh();
      },
    ]
  );

  const [, executeUpdateBalance, isLoadingUpdateBalance] = useAction(
    updateBalance,
    [
      ,
      (response) => {
        if (response) {
          addToast({
            title: "Update Balance",
            description: response.message,
          });
        } else {
          addToast({
            title: "Update Balance",
            description: "Balance updated successfully!",
          });
        }
        refresh();
        setIsBalanceModalOpen(false);
        setCurrentBalanceItemId(null);
        setBalanceInput("");
      },
    ]
  );

  const [, executeResetTransactionPassword, isLoadingResetTransactionPassword] =
    useAction(resetTransactionPassword, [
      ,
      (response) => {
        if (response) {
          addToast({
            title: "Reset Transaction Password",
            description: response.message,
          });
        } else {
          addToast({
            title: "Reset Transaction Password",
            description: "Transaction password reset successfully!",
          });
        }
        refresh();
      },
    ]);

  const [, executeAddRemark, isLoadingRemark] = useAction(addRemarksUser, [
    ,
    (remarkResponse) => {
      if (remarkResponse) {
        addToast({
          title: "Remark",
          description: remarkResponse.message,
        });
      } else {
        addToast({
          title: "Remark",
          description: "Remark Set successful!",
        });
      }
      refresh();
    },
  ]);

  // Balance modal handlers
  const openBalanceModal = (itemId: string) => {
    setCurrentBalanceItemId(itemId);
    setBalanceInput("");
    setIsBalanceModalOpen(true);
  };
  const handleCloseBalanceModal = () => {
    setIsBalanceModalOpen(false);
    setCurrentBalanceItemId(null);
    setBalanceInput("");
  };
  const handleSubmitBalance = async () => {
    if (!currentBalanceItemId || balanceInput.trim() === "") {
      addToast({
        title: "Error",
        description: "User ID and balance are required.",
      });
      return;
    }
    const balance = parseFloat(balanceInput);
    if (isNaN(balance)) {
      addToast({
        title: "Error",
        description: "Balance must be a valid number.",
      });
      return;
    }
    await executeUpdateBalance(currentBalanceItemId, balance);
  };

  const openRemarkModal = (itemId: string) => {
    setCurrentRemarkItemId(itemId);
    setRemarkText("");
    setIsRemarkModalOpen(true);
  };
  const handleCloseRemarkModal = () => {
    setIsRemarkModalOpen(false);
    setCurrentRemarkItemId(null);
    setRemarkText("");
  };
  const handleSubmitRemark = async () => {
    if (!currentRemarkItemId || remarkText.trim() === "") {
      addToast({
        title: "Error",
        description: "Item ID and remark text are required.",
      });
      return;
    }
    await executeAddRemark(currentRemarkItemId, remarkText);
  };

  const [, executeSetTask, isLoadingSetTask] = useAction(setTask, [
    ,
    (taskResponse) => {
      if (taskResponse) {
        addToast({
          title: "Task",
          description: `${taskResponse.message}${
            typeof taskResponse.todayTask !== "undefined"
              ? ` (Today's Task: ${taskResponse.todayTask})`
              : ""
          }`,
        });
      } else {
        addToast({
          title: "Task",
          description: "Task Set successful!",
        });
      }
      refresh();
    },
  ]);

  const openOrderModal = (itemId: string) => {
    setCurrentOrderItemId(itemId);
    setOrderNumberInput("");
    setIsOrderModalOpen(true);
  };
  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
    setCurrentOrderItemId(null);
    setOrderNumberInput("");
  };
  const handleSubmitOrder = async () => {
    if (!currentOrderItemId || orderNumberInput.trim() === "") {
      addToast({
        title: "Error",
        description: "Item ID and order number are required.",
      });
      return;
    }
    const orderNum = parseInt(orderNumberInput, 10);
    if (isNaN(orderNum)) {
      addToast({
        title: "Error",
        description: "Order number must be a valid number.",
      });
      return;
    }
    await executeSetTask(currentOrderItemId, orderNum);
  };

  const [profitResponse, executeAddProfitCard, isLoadingAddProfitCard] =
    useAction(addprofitCard, [
      ,
      () => {
        if (profitResponse) {
          addToast({
            title: "Profit",
            description: `${profitResponse.message}${
              profitResponse?.profitCard?.orderNumber
                ? ` (add at Order Number ${profitResponse.profitCard.orderNumber})`
                : ""
            }`,
          });
        } else {
          addToast({
            title: "Profit",
            description: "Profit Set successful!",
          });
        }
      },
    ]);

  const openProfitModal = (itemId: string) => {
    setCurrentProfitItemId(itemId);
    setProfitOrderNumberInput("");
    setProfitAmountInput("");
    setPriceDifferenceInput("");
    setIsProfitModalOpen(true);
  };
  const handleCloseProfitModal = () => {
    setIsProfitModalOpen(false);
    setCurrentProfitItemId(null);
    setProfitOrderNumberInput("");
    setProfitAmountInput("");
    setPriceDifferenceInput("");
  };
  const handleSubmitProfit = async () => {
    if (
      !currentProfitItemId ||
      profitOrderNumberInput.trim() === "" ||
      profitAmountInput.trim() === "" ||
      priceDifferenceInput.trim() === ""
    ) {
      addToast({
        title: "Error",
        description: "All profit fields are required.",
      });
      return;
    }
    const orderNum = parseInt(profitOrderNumberInput, 10);
    const profit = parseFloat(profitAmountInput);
    const priceDiff = parseFloat(priceDifferenceInput);

    if (isNaN(orderNum) || isNaN(profit) || isNaN(priceDiff)) {
      addToast({
        title: "Error",
        description:
          "Order number, profit, and price difference must be valid numbers.",
      });
      return;
    }
    await executeAddProfitCard(
      orderNum,
      profit,
      priceDiff,
      currentProfitItemId
    );
  };

  const rows = (data?.data || []).map((user) => ({
    key: String(user.id),
    id: String(user.id),
    username: user.username ?? "",
    phone: user.phone ?? "",
    email: user.email ?? "",
    isBlocked: user.isBlocked ? "true" : "false",
    invitationCode: user.invitationCode ?? "",
    myCode: user.myCode ?? "",
    remarks: user.remarks ?? "",
    todayTask:
      user.todayTask !== undefined && user.todayTask !== null
        ? String(user.todayTask)
        : "",
    totalTask:
      user.totalTask !== undefined && user.totalTask !== null
        ? String(user.totalTask)
        : "",
    leftTask:
      user.leftTask !== undefined && user.leftTask !== null
        ? String(user.leftTask)
        : "",
    balance:
      user.balance !== undefined && user.balance !== null
        ? String(user.balance)
        : "",
    createdAt: user.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : "N/A",
  }));

  const columns: ColumnDef[] = [
    {
      key: "id",
      label: "#",
      renderCell: (item) => {
        const rowIndexOnPage = rows.findIndex((r) => r.key === item.key);
        return rowIndexOnPage !== -1
          ? (page - 1) * pageSize + rowIndexOnPage + 1
          : item.id;
      },
    },
    { key: "username", label: "Username" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "todayTask", label: "Today Tasks" },
    { key: "totalTask", label: "Total Tasks" },
    { key: "leftTask", label: "Left Tasks" },
    { key: "balance", label: "Balance" },
    { key: "remarks", label: "Remarks" },
    { key: "createdAt", label: "Joined Date" },
    { key: "myCode", label: "My Code" },
    {
      key: "isBlocked",
      label: "Status",
      renderCell: (item) => (
        <Button
          size="sm"
          variant="flat"
          color={item.isBlocked ? "danger" : "success"}
          onPress={() => {
            if (item.isBlocked) {
              if (item.id) {
                executeUnblockUser(String(item.id));
              }
            } else {
              if (item.id !== undefined) {
                executeBlockUser(String(item.id));
              }
            }
          }}
          isLoading={isLoadingBlock || isLoadingUnblock}
          startContent={
            item.isBlocked ? (
              <Unlock className="size-4" />
            ) : (
              <Lock className="size-4" />
            )
          }
        >
          {item.isBlocked ? "Blocked" : "Active"}
        </Button>
      ),
    },
    {
      key: "action",
      label: "Action",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button size="sm" color="warning" variant="flat">
                Reset
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Reset Actions">
              <DropdownItem
                key="resetPassword"
                onPress={() => {
                  if (item.id !== undefined) {
                    executeResetPassword(String(item.id));
                  }
                }}
                isDisabled={isLoadingResetPassword}
              >
                Password
              </DropdownItem>
              <DropdownItem
                key="resetTransactionPassword"
                onPress={() => {
                  if (item.id !== undefined) {
                    executeResetTransactionPassword(String(item.id));
                  }
                }}
                isDisabled={isLoadingResetTransactionPassword}
              >
                Transaction Password
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button
            size="sm"
            color="success"
            variant="flat"
            onPress={() => openOrderModal(String(item.id))}
          >
            Set Order
          </Button>
          <Button
            size="sm"
            color="primary"
            variant="flat"
            onPress={() => {
              if (item.id !== undefined) {
                openProfitModal(String(item.id));
              }
            }}
          >
            Add profit
          </Button>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            onPress={() => {
              if (item.id !== undefined) {
                openRemarkModal(String(item.id));
              }
            }}
          >
            Add remark
          </Button>
          <Button
            size="sm"
            color="secondary"
            variant="flat"
            onPress={() => {
              if (item.id !== undefined) {
                openBalanceModal(String(item.id));
              }
            }}
          >
            Update Balance
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading && !data?.data && page === 1) {
    return (
      <div className="flex justify-center items-center h-full">
        Loading customers...
      </div>
    );
  }

  return (
    <div className={`p-2 md:p-4 lg:p-6 h-full flex flex-col`}>
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

      {/* Remark Modal */}
      {isRemarkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Remark</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Enter remark..."
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              disabled={isLoadingRemark}
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onPress={handleCloseRemarkModal}
                disabled={isLoadingRemark}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSubmitRemark}
                disabled={isLoadingRemark || remarkText.trim() === ""}
              >
                {isLoadingRemark ? "Submitting..." : "Submit Remark"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Set Order Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Set Order Task</h2>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter order number"
              value={orderNumberInput}
              onChange={(e) => setOrderNumberInput(e.target.value)}
              disabled={isLoadingSetTask}
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onPress={handleCloseOrderModal}
                disabled={isLoadingSetTask}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSubmitOrder}
                disabled={isLoadingSetTask || orderNumberInput.trim() === ""}
              >
                {isLoadingSetTask ? "Submitting..." : "Submit Order"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Profit Modal */}
      {isProfitModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Profit Card</h2>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Order Number"
              value={profitOrderNumberInput}
              onChange={(e) => setProfitOrderNumberInput(e.target.value)}
              disabled={isLoadingAddProfitCard}
            />
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Profit Amount"
              value={profitAmountInput}
              onChange={(e) => setProfitAmountInput(e.target.value)}
              disabled={isLoadingAddProfitCard}
            />
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Price Difference"
              value={priceDifferenceInput}
              onChange={(e) => setPriceDifferenceInput(e.target.value)}
              disabled={isLoadingAddProfitCard}
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onPress={handleCloseProfitModal}
                disabled={isLoadingAddProfitCard}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSubmitProfit}
                disabled={
                  isLoadingAddProfitCard ||
                  profitOrderNumberInput.trim() === "" ||
                  profitAmountInput.trim() === "" ||
                  priceDifferenceInput.trim() === ""
                }
              >
                {isLoadingAddProfitCard ? "Submitting..." : "Submit Profit"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Update Balance Modal */}
      {isBalanceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Update Balance</h2>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter new balance"
              value={balanceInput}
              onChange={(e) => setBalanceInput(e.target.value)}
              disabled={isLoadingUpdateBalance}
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onPress={handleCloseBalanceModal}
                disabled={isLoadingUpdateBalance}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSubmitBalance}
                disabled={isLoadingUpdateBalance || balanceInput.trim() === ""}
              >
                {isLoadingUpdateBalance ? "Updating..." : "Update Balance"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerPage;
