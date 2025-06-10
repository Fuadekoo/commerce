"use client";
import React from "react";
import { Card, CardBody } from "@heroui/react";
import { PlayCircle, Users, ShoppingCart, DollarSign, Star } from "lucide-react";

type DataCardItem = {
    title: string;
    subtitle: string;
    value: number | string;
    bgColor: string;
    buttonBg: string;
    buttonIcon: string;
    subtitleColor: string;
    icon: React.ReactNode;
};
const data: DataCardItem[] = [
    {
        title: "Total Orders",
        subtitle: "All Orders",
        value: 1520,
        bgColor: "bg-blue-800 text-white",
        buttonBg: "bg-white",
        buttonIcon: "text-blue-800",
        subtitleColor: "text-blue-100",
        icon: <ShoppingCart className="w-5 h-5 text-blue-100" />,
    },
    {
        title: "Completed Orders",
        subtitle: "Delivered",
        value: 1340,
        bgColor: "bg-white text-gray-900",
        buttonBg: "bg-blue-800",
        buttonIcon: "text-white",
        subtitleColor: "text-gray-500",
        icon: <PlayCircle className="w-5 h-5 text-green-600" />,
    },
    {
        title: "Pending Orders",
        subtitle: "Awaiting",
        value: 120,
        bgColor: "bg-white text-gray-900",
        buttonBg: "bg-blue-800",
        buttonIcon: "text-white",
        subtitleColor: "text-gray-500",
        icon: <PlayCircle className="w-5 h-5 text-yellow-500" />,
    },
    {
        title: "Failed Orders",
        subtitle: "Cancelled/Failed",
        value: 60,
        bgColor: "bg-white text-gray-900",
        buttonBg: "bg-blue-800",
        buttonIcon: "text-white",
        subtitleColor: "text-gray-500",
        icon: <PlayCircle className="w-5 h-5 text-red-500" />,
    },
    {
        title: "Total Balance",
        subtitle: "Wallet",
        value: "$8,200",
        bgColor: "bg-white text-gray-900",
        buttonBg: "bg-blue-800",
        buttonIcon: "text-white",
        subtitleColor: "text-gray-500",
        icon: <DollarSign className="w-5 h-5 text-blue-800" />,
    },
    {
        title: "Total Invited Users",
        subtitle: "Referrals",
        value: 340,
        bgColor: "bg-white text-gray-900",
        buttonBg: "bg-blue-800",
        buttonIcon: "text-white",
        subtitleColor: "text-gray-500",
        icon: <Users className="w-5 h-5 text-blue-800" />,
    },
    {
        title: "Total Invite Commission",
        subtitle: "Earned",
        value: "$1,250",
        bgColor: "bg-white text-gray-900",
        buttonBg: "bg-blue-800",
        buttonIcon: "text-white",
        subtitleColor: "text-gray-500",
        icon: <Star className="w-5 h-5 text-blue-800" />,
    },
];

function DataCard() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {data.map((item, idx) => (
                <Card
                    className={`rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105 ${item.bgColor}`}
                    key={idx}
                >
                    <CardBody className="relative p-6">
                        <button
                            className={`absolute top-4 right-4 p-2 rounded-full shadow-md hover:scale-110 transition ${item.buttonBg}`}
                            aria-label="Action"
                        >
                            <PlayCircle className={`w-6 h-6 ${item.buttonIcon}`} />
                        </button>
                        <div className="mb-4">{item.icon}</div>
                        <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                        <p className={`text-sm mb-3 ${item.subtitleColor}`}>{item.subtitle}</p>
                        <div className="text-xl font-semibold">{item.value}</div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}

export default DataCard;
