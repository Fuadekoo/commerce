import React from "react";
import Image from "next/image";
import { User, DollarSign, Users, Gift, Phone, Pen } from "lucide-react";

function Page() {
  // Sample user data
  const user = {
    name: "Shane",
    phone: "+1 234 567 890",
    email: "shane.sine@gmail.com",
    balance: 1250.75,
    invitedUsers: 8,
    commission: 320.5,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-1 px-1 overflow-auto">
      <div className="max-w-3xl mx-auto rounded-2xl shadow-xl p-4 flex flex-col gap-8 items-center">
        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="relative">
            <Image
              src="/profile.jpg"
              width={96}
              height={96}
              priority
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-green-400 shadow-lg ring-4 ring-green-100 object-cover"
            />
            <span className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1 border-2 border-white">
              <User className="w-4 h-4 text-white" />
            </span>
          </div>
        </div>
        {/* Combined Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
          <div className="flex flex-col items-center bg-white rounded-xl shadow p-3">
            <DollarSign className="w-6 h-6 text-green-500 mb-1" />
            <p className="text-lg font-bold text-green-700">
              ${user.balance.toLocaleString()}
            </p>
            <p className="text-gray-500 text-xs mt-1">Balance</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-xl shadow p-3">
            <Users className="w-6 h-6 text-blue-500 mb-1" />
            <p className="text-lg font-bold text-blue-700">
              {user.invitedUsers}
            </p>
            <p className="text-gray-500 text-xs mt-1">Invited</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-xl shadow p-3">
            <Gift className="w-6 h-6 text-orange-500 mb-1" />
            <p className="text-lg font-bold text-orange-600">
              ${user.commission.toLocaleString()}
            </p>
            <p className="text-gray-500 text-xs mt-1">Commission</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-xl shadow p-3">
            <DollarSign className="w-6 h-6 text-green-400 mb-1" />
            <p className="text-lg font-bold text-green-700">$120.50</p>
            <p className="text-gray-500 text-xs mt-1">Today Profit</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-xl shadow p-3">
            <DollarSign className="w-6 h-6 text-blue-400 mb-1" />
            <p className="text-lg font-bold text-blue-700">$850.00</p>
            <p className="text-gray-500 text-xs mt-1">Week Profit</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-xl shadow p-3">
            <DollarSign className="w-6 h-6 text-orange-400 mb-1" />
            <p className="text-lg font-bold text-orange-600">$3,200.00</p>
            <p className="text-gray-500 text-xs mt-1">Month Profit</p>
          </div>
        </div>
        {/* Profile Info */}
        <div className="w-full flex flex-col items-center">
          <button className="px-2 py-0 hover:bg-green-600 text-gray-700 rounded-lg font-semibold flex items-center gap-2 shadow transition mb-2">
            <Pen className="w-5 h-5" />
            Update
          </button>
          <h2 className="text-2xl font-extrabold text-gray-800 mb-1">
            {user.name}
          </h2>
          <div className="flex items-center gap-2 text-gray-500 text-base">
            <Phone className="w-4 h-4" />
            <span>{user.phone}</span>
          </div>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
      </div>
    </div>
  );
}

export default Page;
