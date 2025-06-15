"use client";
import React from "react";
import { Button } from "@heroui/react"; // Import Button from HeroUI

function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
      <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl text-center">
        <div className="mb-4">
          {/* SVG Error Icon */}
          <svg
            className="w-16 h-16 text-red-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-3">
          Something went wrong!
        </h1>
        <p className="text-md md:text-lg mb-6">
          An unexpected error occurred. We're sorry for the inconvenience.
        </p>
        {/* Optional: Display error message in development or if needed */}
        {/* {process.env.NODE_ENV === 'development' && error?.message && (
          <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded mb-6">
            Error details: {error.message}
          </p>
        )} */}
        <Button
          variant="flat"
          color="danger" // Set color to warning
          onPress={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          // You can adjust size or variant if needed, e.g., size="lg"
          // className="px-6 py-3 font-semibold rounded-lg transition duration-150 ease-in-out" // HeroUI Button has its own styling, className might override or conflict
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}

export default Error;
