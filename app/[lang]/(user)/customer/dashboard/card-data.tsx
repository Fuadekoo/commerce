"use client";
import React from "react";
import { Card, CardBody } from "@heroui/react";
import {
  PlayCircle,
  Users,
  DollarSign,
  ClipboardList, // For Total Tasks
  ClipboardCheck, // For Today's Tasks (completed) or generic task icon
  ClipboardX, // For Left Tasks (pending)
} from "lucide-react";
import useAction from "@/hooks/useAction";
import { dashboard } from "@/actions/user/dashboard";

// Type for a single card item, remains the same
type DataCardItem = {
  title: string;
  subtitle: string;
  value: number | string;
  bgColor: string;
  buttonBg: string;
  buttonIcon: string;
  subtitleColor: string;
  icon: React.ReactNode;
  key: string; // Add a unique key for mapping
};

// Define the expected structure of the data from the `dashboard` server action
interface DashboardStats {
  totalTasks: number;
  todayTasks: number;
  leftTasks: number;
  balance: number | string;
  totalInvited: number;
  // Include other fields if your dashboard action returns them
  // e.g., totalOrders?: number; totalInviteCommission?: number | string;
}

function DataCard() {
  // Fetch dynamic data using useAction
  // Renamed 'data' from useAction to 'dashboardData' to avoid conflict
  const [data, action, isLoading] = useAction(dashboard, [true, () => {}]);
  // Handle loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Placeholder for loading state, e.g., 5 shimmer cards */}
        {Array.from({ length: 5 }).map((_, idx) => (
          <Card
            key={`loading-${idx}`}
            className="rounded-xl overflow-hidden shadow-lg p-6 animate-pulse bg-gray-200 dark:bg-gray-700"
          >
            <div className="h-8 w-3/4 mb-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 w-1/2 mb-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-10 w-1/2 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  // Transform the fetched dashboardData into an array of DataCardItem
  // Customize titles, icons, and colors as needed
  const cardItems: DataCardItem[] = [
    {
      key: "totalTasks",
      title: "Total Tasks",
      subtitle: "All assigned tasks",
      value: data?.user.totalTask || 0, // Use optional chaining to handle undefined
      bgColor: "bg-purple-600 text-white", // Example color
      buttonBg: "bg-white",
      buttonIcon: "text-purple-600",
      subtitleColor: "text-purple-100",
      icon: <ClipboardList className="w-5 h-5 text-purple-100" />,
    },
    {
      key: "todayTasks",
      title: "Today's Tasks",
      subtitle: "Tasks for today",
      value: data?.user.todayTask || 0,
      bgColor: "bg-green-500 text-white", // Example color
      buttonBg: "bg-white",
      buttonIcon: "text-green-500",
      subtitleColor: "text-green-100",
      icon: <ClipboardCheck className="w-5 h-5 text-green-100" />,
    },
    {
      key: "leftTasks",
      title: "Tasks Left",
      subtitle: "Pending completion",
      value: data?.user.leftTask || 0,
      bgColor: "bg-yellow-500 text-gray-900", // Example color
      buttonBg: "bg-gray-800",
      buttonIcon: "text-yellow-500",
      subtitleColor: "text-yellow-700",
      icon: <ClipboardX className="w-5 h-5 text-yellow-700" />,
    },
    {
      key: "balance",
      title: "Total Balance",
      subtitle: "Wallet",
      value:
        typeof data?.user.balance === "number"
          ? `$${(data?.user.balance as number).toFixed(2)}`
          : typeof data?.user.balance === "object" &&
            data?.user.balance !== null &&
            "toString" in data.user.balance
          ? `$${data.user.balance}`
          : data?.user.balance ?? 0,
      bgColor: "bg-blue-800 text-white",
      buttonBg: "bg-white",
      buttonIcon: "text-blue-800",
      subtitleColor: "text-blue-100",
      icon: <DollarSign className="w-5 h-5 text-blue-100" />,
    },
    {
      key: "totalInvited",
      title: "Total Invited Users",
      subtitle: "Referrals",
      value: data?.totalInvited || 0,
      bgColor: "bg-pink-500 text-white", // Example color
      buttonBg: "bg-white",
      buttonIcon: "text-pink-500",
      subtitleColor: "text-pink-100",
      icon: <Users className="w-5 h-5 text-pink-100" />,
    },
    // You can add more cards here if your dashboardData has more fields
    // e.g., for totalOrders, totalInviteCommission, etc.
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {" "}
      {/* Adjusted grid for 5 items */}
      {cardItems.map((item) => (
        <Card
          className={`rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105 ${item.bgColor}`}
          key={item.key} // Use the unique key from cardItems
        >
          <CardBody className="relative p-6">
            <button
              className={`absolute top-4 right-4 p-2 rounded-full shadow-md hover:scale-110 transition ${item.buttonBg}`}
              aria-label="Action"
              // onClick={() => console.log("Action for:", item.title)} // Example action
            >
              {/* You might want different icons for different cards or a generic one */}
              <PlayCircle className={`w-6 h-6 ${item.buttonIcon}`} />
            </button>
            <div className="mb-4">{item.icon}</div>
            <h4 className="text-lg font-bold mb-1">{item.title}</h4>
            <p className={`text-sm mb-3 ${item.subtitleColor}`}>
              {item.subtitle}
            </p>
            <div className="text-xl font-semibold">{item.value}</div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export default DataCard;
