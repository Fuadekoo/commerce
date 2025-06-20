import Image from "next/image";
import React from "react";

const orders = [
  {
    name: "Gradient Graphic T-shirt",
    size: "Large",
    color: "White",
    price: "$145",
    image: "https://via.placeholder.com/100",
  },
  {
    name: "Checkered Shirt",
    size: "Medium",
    color: "Red",
    price: "$180",
    image: "https://via.placeholder.com/100",
  },
  {
    name: "Skinny Fit Jeans",
    size: "Large",
    color: "Blue",
    price: "$240",
    image: "https://via.placeholder.com/100",
  },
];

function OrderList() {
  return (
    <div className="w-auto mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>

      {/* Order List */}
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border p-4 rounded-lg shadow-md"
          >
            <Image
              src={order.image}
              alt={order.name}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{order.name}</h3>
              <p className="text-gray-600">
                Size: {order.size} | Color: {order.color}
              </p>
              <p className="text-gray-800 font-bold">{order.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderList;
