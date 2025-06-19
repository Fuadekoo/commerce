"use client";
import React, { useState } from "react";
import useAction from "@/hooks/useAction";
import { addToast } from "@heroui/toast";
import { madeOrder } from "@/actions/user/order";

function Summary() {
  const [orderResponse, orderAction, isOrdering] = useAction(madeOrder, [
    ,
    (response) => {
      if (response) {
        addToast({
          title: "Order",
          description: response.message,
        });
      } else {
        addToast({
          title: "Order",
          description: "Order successful!",
        });
      }
    },
  ]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showProfitModal, setShowProfitModal] = useState(false);

  const handleStart = async () => {
    await orderAction();
    setShowProductModal(true);
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    if (orderResponse && orderResponse.profitCard) {
      setShowProfitModal(true);
    }
  };

  const handleCloseProfitModal = () => {
    setShowProfitModal(false);
  };

  return (
    <div>
      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
        <p>
          Subtotal: <span className="font-bold">$565</span>
        </p>
        <p>
          Discount (20%): <span className="text-red-500">-$113</span>
        </p>
        <p>
          Delivery Fee: <span className="font-bold">$15</span>
        </p>
        <p className="text-lg font-bold mt-2">
          Total: <span className="text-green-600">$467</span>
        </p>
        <button
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          onClick={handleStart}
          disabled={isOrdering}
        >
          start(0/60)
        </button>
      </div>

      {/* Products Modal */}
      {showProductModal && orderResponse && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={handleCloseProductModal}
            >
              <span className="text-2xl">&times;</span>
            </button>
            <h4 className="text-lg font-semibold mb-3 text-center">Products</h4>
            {orderResponse.products && orderResponse.products.length > 0 ? (
              <div className="grid gap-3">
                {orderResponse.products.map((product: any) => (
                  <div
                    key={product.id}
                    className="border rounded-lg p-4 bg-white shadow flex flex-col md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="font-bold">{product.name}</div>
                      <div className="text-gray-500 text-sm">
                        Order Number: {product.orderNumber}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-10">
                No products found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profit Card Modal */}
      {showProfitModal && orderResponse && orderResponse.profitCard && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={handleCloseProfitModal}
            >
              <span className="text-2xl">&times;</span>
            </button>
            <h4 className="text-lg font-semibold mb-3 text-center">
              Profit Card
            </h4>
            <div className="border rounded-lg p-4 bg-green-50 shadow">
              <div>
                <span className="font-bold">Order Number:</span>{" "}
                {orderResponse.profitCard.orderNumber}
              </div>
              {/* Add more profit card fields as needed */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Summary;
