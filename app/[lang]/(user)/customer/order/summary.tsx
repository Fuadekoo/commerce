"use client";
import React, { useState } from "react";
import useAction from "@/hooks/useAction";
import { addToast } from "@heroui/toast";
import { makeTrick } from "@/actions/user/order";
import { getProductStats } from "@/actions/user/product";
import { getUser } from "@/actions/user/newUser";
import Image from "next/image";

type StepperProduct = {
  name: string;
  orderNumber?: string | number;
  photo?: string;
  // Add other fields you use in ProductStepper
};

function ProductStepper({
  products,
  onFinish,
}: {
  products: StepperProduct[];
  onFinish: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (current < products.length - 1) {
        setCurrent((prev) => prev + 1);
      } else {
        onFinish();
      }
    }, 700); // simulate loading
  };

  const product = products[current];

  return (
    <div>
      <div className="border rounded-lg p-4 bg-white shadow flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <div className="font-bold">{product.name}</div>
          <div className="text-gray-500 text-sm">
            Order Number: {product.orderNumber}
          </div>
          {/* <div className="text-gray-500 text-sm">
            Price: ${product.price.toFixed(2)}
          </div> */}
          {product.photo && (
            <Image
              src={`/api/filedata/${product.photo}`}
              width={96}
              height={96}
              alt={product.name}
              className="w-100 h-60 object-cover rounded mt-2"
            />
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handleNext}
          disabled={loading}
        >
          {current < products.length - 1
            ? loading
              ? "Loading..."
              : "Buy & Sell"
            : loading
            ? "Loading..."
            : "Finish"}
        </button>
      </div>
    </div>
  );
}

function Summary() {
  const [product, ,] = useAction(getProductStats, [true, () => {}]);
  const [user, ,] = useAction(getUser, [true, () => {}]);
  const [orderResponse, orderAction, isOrdering] = useAction(makeTrick, [
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
        {/* Product stats */}
        <div className="mb-2">
          <div>
            <span className="font-bold">Total Products:</span>{" "}
            {product?.totalProducts ?? 0}
          </div>
          <div>
            <span className="font-bold">Total Price:</span> $
            {product?.totalPrice ?? 0}
          </div>
          <div>
            <span className="font-bold">Total Stocks:</span>{" "}
            {product?.totalStocks ?? 0}
          </div>
        </div>

        <button
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          onClick={handleStart}
          disabled={isOrdering}
        >
          start({user?.user?.todayTask ?? 0}/60)
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
              <ProductStepper
                products={orderResponse.products}
                onFinish={handleCloseProductModal}
              />
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
                <div>
                  <span className="font-bold">Profit:</span>{" "}
                  {orderResponse.profitCard.profit}
                </div>
                <div>
                  <span className="font-bold">priceDifference:</span>{" "}
                  {orderResponse.profitCard.priceDifference}
                </div>
                <div>
                  <span className="font-bold">Status:</span>{" "}
                  {orderResponse.profitCard.status}
                </div>
                <div>
                  <span className="font-bold">Created At:</span>{" "}
                  {new Date(
                    orderResponse.profitCard.createdAt
                  ).toLocaleDateString()}
                </div>
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
