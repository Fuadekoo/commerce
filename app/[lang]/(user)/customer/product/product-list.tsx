"use client";
import React, { useState } from "react";
import { ShoppingBasketIcon, ShoppingBasket, PlusCircle } from "lucide-react";

const products = [
  {
    name: "Women's Knitted Slim Top + Wide",
    price: "Br 1,391.00",
    rating: 5,
    reviews: 1,
    image: "https://picsum.photos/seed/picsum/200/300",
  },
  {
    name: "Women Watch",
    price: "Br 913.75",
    rating: 5,
    reviews: 1,
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Vitamin C Advance",
    price: "Br 3,210.00",
    rating: 5,
    reviews: 1,
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Acne Foaming Cream Cleanser",
    price: "Br 4,280.00",
    rating: 5,
    reviews: 1,
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Bajaj Almond Drops",
    price: "Br 860.00",
    rating: 5,
    reviews: 1,
    image: "https://via.placeholder.com/150",
  },

  {
    name: "Vitamin C Advance",
    price: "Br 3,210.00",
    rating: 5,
    reviews: 1,
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Acne Foaming Cream Cleanser",
    price: "Br 4,280.00",
    rating: 5,
    reviews: 1,
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Bajaj Almond Drops",
    price: "Br 860.00",
    rating: 5,
    reviews: 1,
    image: "https://via.placeholder.com/150",
  },
];

function parsePrice(priceStr: string) {
  // Extract number from "Br 1,391.00"
  return Number(priceStr.replace(/[^\d.]/g, ""));
}

function ProductList() {
  const [showFilter, setShowFilter] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");

  // Filtering logic
  const filteredProducts = products.filter((product) => {
    const price = parsePrice(product.price);
    const rating = product.rating;
    return (
      (!minPrice || price >= Number(minPrice)) &&
      (!maxPrice || price <= Number(maxPrice)) &&
      (!minRating || rating >= Number(minRating))
    );
  });

  return (
    <div className="relative w-auto mx-auto bg-white overflow-y-auto shadow-md rounded-lg">
      {/* Filter Button */}
      <button
        className="fixed top-24 right-6 z-40 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
        onClick={() => setShowFilter(true)}
      >
        Filter
      </button>

      {/* Filter Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform ${
          showFilter ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold">Filter Products</h3>
          <button
            className="text-gray-500 hover:text-gray-800 text-2xl"
            onClick={() => setShowFilter(false)}
          >
            ×
          </button>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium">Min Price</label>
            <input
              type="number"
              className="border rounded px-2 py-1 w-full"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="e.g. 1000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Max Price</label>
            <input
              type="number"
              className="border rounded px-2 py-1 w-full"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="e.g. 4000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Min Rating</label>
            <input
              type="number"
              min={1}
              max={5}
              className="border rounded px-2 py-1 w-full"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              placeholder="e.g. 4"
            />
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
            onClick={() => setShowFilter(false)}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {showFilter && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setShowFilter(false)}
        />
      )}

      <h2 className="text-2xl font-bold mb-4">Popular Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md"
            />
            <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
            <p className="text-gray-700">{product.price}</p>
            <div className="flex items-center justify-between mt-2">
              <PlusCircle className="w-7 h-7 bg-white text-blue-600 hover:text-blue-800 cursor-pointer" />
              <span className="text-gray-500">Add to Cart</span>
            </div>
            {/* <div className="flex justify-end mt-2">
              <ShoppingBasket className="w-7 h-7 bg-white text-blue-600 hover:text-blue-800 cursor-pointer" />
            </div> */}
            <p className="text-yellow-500">
              ⭐ {product.rating} ({product.reviews} review)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
