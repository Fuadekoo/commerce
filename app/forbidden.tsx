"use client";
// import { Button } from "@heroui/react";
import React from "react";

function Forbidden() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex items-center justify-center mb-4">
          <svg
            className="w-16 h-16 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <line
              x1="8"
              y1="8"
              x2="16"
              y2="16"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="16"
              y1="8"
              x2="8"
              y2="16"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          403 - Forbidden
        </h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to access this resource.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

export default Forbidden;
