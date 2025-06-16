"use client";
import React from "react";
import { Card, CardBody } from "@heroui/react";
import {
  PlayCircle,
  Users,
  ShoppingCart,
  DollarSign,
  CreditCard,
  Award, // Added for Top User Balance
} from "lucide-react";
import useAction from "@/hooks/useAction";
import { adminDashboard } from "@/actions/admin/dashboard";
import { Decimal } from "@prisma/client/runtime/library"; // Import Decimal if you need to check its type

// Type for individual card display properties
type DataCardItem = {
  id: string; // Added for unique key
  title: string;
  subtitle: string;
  value: number | string;
  bgColor: string;
  buttonBg: string;
  buttonIconColor: string; // Renamed for clarity
  subtitleColor: string;
  icon: React.ReactNode;
};

// Expected structure from adminDashboard action
interface AdminDashboardResponse {
  users?: {
    // Optional chaining for safety
    total: number;
    totalBalance: number | Decimal;
    topBalanceUser: {
      balance: Decimal;
      username?: string; // Optional: if you want to display username
    } | null;
  };
  products?: {
    total: number;
  };
  profitCards?: {
    pending: number;
  };
  // Add other properties your dashboard action returns
}

// Helper to convert Decimal to number
const toNumber = (value: number | Decimal | undefined | null): number => {
  if (value === undefined || value === null) return 0;
  if (typeof value === "number") return value;
  // Assuming Decimal has a toNumber() or similar method, or can be parsed
  // For Prisma's Decimal, it can be converted via Number() or parseFloat()
  return Number(value);
};

function DataCard() {
  const [dashboardData, refresh, isLoading] = useAction(adminDashboard, [
    true,
    () => {},
  ]);

  if (isLoading || !dashboardData) {
    // Check for dashboardData as well
    return (
      <div className="text-center text-gray-500 py-10">
        Loading dashboard data...
      </div>
    );
  }

  // Transform the fetched dashboardData object into an array of DataCardItem
  const cardsToDisplay: DataCardItem[] = [];

  if (dashboardData.users) {
    cardsToDisplay.push({
      id: "totalUsers",
      title: "Total Users",
      subtitle: "Registered",
      value: dashboardData.users.total,
      bgColor: "bg-blue-600 text-white",
      buttonBg: "bg-white",
      buttonIconColor: "text-blue-600",
      subtitleColor: "text-blue-100",
      icon: <Users className="w-8 h-8 text-blue-100" />,
    });
    cardsToDisplay.push({
      id: "totalUserBalance",
      title: "Total User Balance",
      subtitle: "Combined",
      value: `$${toNumber(dashboardData.users.totalBalance).toFixed(2)}`,
      bgColor: "bg-indigo-600 text-white",
      buttonBg: "bg-white",
      buttonIconColor: "text-indigo-600",
      subtitleColor: "text-indigo-100",
      icon: <DollarSign className="w-8 h-8 text-indigo-100" />,
    });
    if (dashboardData.users.topBalanceUser) {
      cardsToDisplay.push({
        id: "topUserBalance",
        title: "Top User Balance",
        subtitle: "Highest Balance",
        value: `$${toNumber(dashboardData.users.topBalanceUser.balance).toFixed(
          2
        )}`,
        bgColor: "bg-purple-600 text-white",
        buttonBg: "bg-white",
        buttonIconColor: "text-purple-600",
        subtitleColor: "text-purple-100",
        icon: <Award className="w-8 h-8 text-purple-100" />,
      });
    }
  }

  if (dashboardData.products) {
    cardsToDisplay.push({
      id: "totalProducts",
      title: "Total Products",
      subtitle: "In Store",
      value: dashboardData.products.total,
      bgColor: "bg-green-600 text-white",
      buttonBg: "bg-white",
      buttonIconColor: "text-green-600",
      subtitleColor: "text-green-100",
      icon: <ShoppingCart className="w-8 h-8 text-green-100" />,
    });
  }

  if (dashboardData.profitCards) {
    cardsToDisplay.push({
      id: "pendingProfitCards",
      title: "Pending Profit Cards",
      subtitle: "Awaiting Action",
      value: dashboardData.profitCards.pending,
      bgColor: "bg-red-500 text-white",
      buttonBg: "bg-white",
      buttonIconColor: "text-red-500",
      subtitleColor: "text-red-100",
      icon: <CreditCard className="w-8 h-8 text-red-100" />,
    });
  }

  // Add more transformations if your adminDashboard returns more data points

  if (cardsToDisplay.length === 0 && !isLoading) {
    return (
      <div className="text-center text-gray-500 py-10">
        No dashboard data available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-4">
      {/* Adjusted grid columns for potentially 5 cards */}
      {cardsToDisplay.map((item) => (
        <Card
          className={`rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105 ${item.bgColor}`}
          key={item.id} // Use the unique id from the transformed item
        >
          <CardBody className="relative p-6">
            <button
              className={`absolute top-4 right-4 p-3 rounded-full shadow-md hover:scale-110 transition-transform ${item.buttonBg}`}
              aria-label="Action"
              // Add onClick handler if this button is supposed to do something
            >
              <PlayCircle className={`w-6 h-6 ${item.buttonIconColor}`} />
            </button>
            <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-black bg-opacity-10">
              {item.icon}
            </div>
            <h4 className="text-xl font-bold mb-1">{item.title}</h4>
            <p className={`text-sm mb-3 ${item.subtitleColor}`}>
              {item.subtitle}
            </p>
            <div className="text-3xl font-semibold">{item.value}</div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export default DataCard;
