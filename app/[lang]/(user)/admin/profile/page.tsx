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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-16 px-4 overflow-auto">
      <div className="max-w-3xl mx-auto rounded-2xl shadow-xl p-4 flex flex-col gap-10 items-center">
        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="relative">
            <h1 className="text-2xl font-bold">Profile</h1>
            <Image
              src="/profile.jpg"
              width={120}
              height={120}
              priority
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-green-400 shadow-lg ring-4 ring-green-100 object-cover"
            />
            <span className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1 border-2 border-white">
              <User className="w-5 h-5 text-white" />
            </span>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 w-full">
          <div className="flex flex-col items-center">
            <DollarSign className="w-8 h-8 text-green-500 mb-2" />
            <p className="text-2xl font-bold text-green-700">
              ${user.balance.toLocaleString()}
            </p>
            <p className="text-gray-500 text-sm mt-1">Total Balance</p>
          </div>
          <div className="flex flex-col items-center">
            <Users className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-2xl font-bold text-blue-700">
              {user.invitedUsers}
            </p>
            <p className="text-gray-500 text-sm mt-1">Invited Users</p>
          </div>
          <div className="flex flex-col items-center">
            <Gift className="w-8 h-8 text-orange-500 mb-2" />
            <p className="text-2xl font-bold text-orange-600">
              ${user.commission.toLocaleString()}
            </p>
            <p className="text-gray-500 text-sm mt-1">Commission</p>
          </div>
        </div>
        {/* Profile Info */}
        <div className="w-full flex flex-col items-center">
          <button className="px-2 py-0 hover:bg-green-600 text-gray-700 rounded-lg font-semibold flex items-center gap-2 shadow transition mb-2">
            <Pen className="w-5 h-5" />
            Update
          </button>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-1">
            {user.name}
          </h2>
          <div className="flex items-center gap-2 text-gray-500 text-lg">
            <Phone className="w-4 h-4" />
            <span>{user.phone}</span>
          </div>
          <p className="text-gray-400">{user.email}</p>
        </div>
      </div>
    </div>
  );
}

export default Page;
