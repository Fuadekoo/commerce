import React from "react";
import {
    User,
    DollarSign,
    Users,
    Gift,
    Phone,
} from "lucide-react";

function Page() {
    // Sample user data
    const user = {
        name: "Shane",
        phone: "+1 234 567 890",
        email: "shane.sine@gmail.com",
        avatar: "https://via.placeholder.com/120",
        balance: 1250.75,
        invitedUsers: 8,
        commission: 320.5,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-16 px-4">
            <div className="max-w-3xl mx-auto bg-white/80 rounded-2xl shadow-xl p-8 flex flex-col md:flex-row gap-10 items-center md:items-start">
                {/* Profile Picture & Actions */}
                <div className="flex flex-col items-center gap-6 w-full md:w-1/3">
                    <div className="relative">
                        <img
                            src={user.avatar}
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-green-400 shadow-lg ring-4 ring-green-100 object-cover"
                        />
                        <span className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1 border-2 border-white">
                            <User className="w-5 h-5 text-white" />
                        </span>
                    </div>
                    <button className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2 shadow transition">
                        <User className="w-5 h-5" />
                        Change Profile
                    </button>
                </div>
                {/* Profile Info & Stats */}
                <div className="flex-1 w-full">
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-800 mb-1">
                            {user.name}
                        </h2>
                        <div className="flex items-center gap-2 text-gray-500 text-lg">
                            <Phone className="w-4 h-4" />
                            <span>{user.phone}</span>
                        </div>
                        <p className="text-gray-400">{user.email}</p>
                    </div>
                    {/* Removed the card UI, just show the data */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                </div>
            </div>
        </div>
    );
}

export default Page;
