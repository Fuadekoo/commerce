import React from "react";

function Summary() {
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
        <button className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Summary;
