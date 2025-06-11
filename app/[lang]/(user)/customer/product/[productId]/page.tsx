"use client";
import React, { useState } from "react";
import { Star, Minus, Plus, Truck, RefreshCcw } from "lucide-react";

const product = {
  name: "Fashion Smart Watch Plus",
  price: 200,
  originalPrice: "US $23.25",
  discount: "64% OFF",
  description:
    "1.32\" Screen For Men's And Women's Bluetooth Call, Arterial Pressure, Blood Oxygen Business Watch.",
  rating: 4.0,
  reviews: 878,
  sold: 1300,
  color: "White",
  shipping: "Free Shipping | Delivery: June 22 - July 8",
  returnPolicy: "30-day return & refund",
  image: "https://via.placeholder.com/300",
};

function formatCurrency(amount: number) {
  return `US $${amount.toFixed(2)}`;
}

function Page() {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Number(e.target.value));
    setQuantity(value);
  };

  return (
    <div className="w-auto mx-auto  bg-white shadow-xl rounded-2xl mt-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="flex-1 flex justify-center items-start">
          <img
            src={product.image}
            alt={product.name}
            className="w-100 h-100 object-cover rounded-xl border"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-red-500 font-bold text-lg">
              {product.discount}
            </span>
            <span className="text-2xl font-bold text-blue-700">
              {formatCurrency(product.price * quantity)}
            </span>
            <span className="line-through text-gray-400 ml-2">
              {product.originalPrice}
            </span>
          </div>
          <p className="mb-4 text-gray-700">{product.description}</p>

          {/* Rating & Sales */}
          <div className="flex items-center gap-6 mb-4">
            <span className="flex items-center text-yellow-500 font-semibold">
              <Star className="w-5 h-5 mr-1 fill-yellow-400" />
              {product.rating}{" "}
              <span className="text-gray-600 ml-1">
                ({product.reviews} reviews)
              </span>
            </span>
            <span className="text-gray-600">{product.sold}+ sold</span>
          </div>

          {/* Color */}
          <div className="mb-2">
            <span className="font-semibold">Color:</span> {product.color}
          </div>

          {/* Shipping & Return */}
          <div className="flex items-center gap-4 mb-2">
            <span className="flex items-center text-green-600">
              <Truck className="w-5 h-5 mr-1" />
              {product.shipping}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <RefreshCcw className="w-4 h-4" />
            <span>{product.returnPolicy}</span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-3 mb-6">
            <label className="font-semibold">Quantity:</label>
            <button
              className="px-3 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              type="button"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={handleQuantityChange}
              className="w-16 text-center border rounded"
            />
            <button
              className="px-3 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
              onClick={() => setQuantity((q) => q + 1)}
              type="button"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Total Price */}
          <div className="mb-6 text-lg font-semibold text-blue-700">
            Total: {formatCurrency(product.price * quantity)}
          </div>

          {/* Buy Button */}
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
