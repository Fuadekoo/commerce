"use client";
import React, { useState } from "react";
import useAction from "@/hooks/useAction";
// import { Button } from "@heroui/react";
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
  const [showResult, setShowResult] = useState(false);

  const handleStart = async () => {
    await orderAction();
    setShowResult(true);
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
      {/* Display products and profit card after start */}
      {showResult && orderResponse && (
        <div className="mt-8 space-y-6">
          {/* Products List */}
          {orderResponse.products && orderResponse.products.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3">Products</h4>
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
                    {/* Add more product fields as needed */}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Profit Card */}
          {orderResponse.profitCard && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">Profit Card</h4>
              <div className="border rounded-lg p-4 bg-green-50 shadow">
                <div>
                  <span className="font-bold">Order Number:</span>{" "}
                  {orderResponse.profitCard.orderNumber}
                </div>
                {/* Add more profit card fields as needed */}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Summary;
