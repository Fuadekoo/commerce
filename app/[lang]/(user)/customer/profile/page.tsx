import React from "react";

function Page() {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Profile Header */}
      <div className="flex flex-col items-center">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile Picture"
          className="w-24 h-24 rounded-full border-4 border-green-500"
        />
        <h2 className="mt-3 text-xl font-bold">Shane</h2>
        <p className="text-gray-500">shane.sine@gmail.com</p>
      </div>

      {/* Stats Section */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-lg font-bold">2h 30m</p>
          <p className="text-gray-500 text-sm">Total time</p>
        </div>
        <div>
          <p className="text-lg font-bold">7200 cal</p>
          <p className="text-gray-500 text-sm">Burned</p>
        </div>
        <div>
          <p className="text-lg font-bold">2</p>
          <p className="text-gray-500 text-sm">Done</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="mt-6 space-y-4">
        {["Personal", "General", "Notification", "Help"].map((item) => (
          <button
            key={item}
            className="w-full py-3 rounded-md text-left text-lg font-semibold bg-gray-100 hover:bg-gray-200"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Page;
