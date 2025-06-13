"use client";
import React from "react";

type Notification = {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
};

const notifications: Notification[] = [
  {
    id: 1,
    title: "Order Shipped",
    message: "Your order #1234 has been shipped.",
    date: "2024-06-10",
    read: false,
  },
  {
    id: 2,
    title: "Welcome!",
    message: "Thank you for signing up.",
    date: "2024-06-09",
    read: true,
  },
  {
    id: 3,
    title: "Password Change",
    message: "Your password was changed successfully.",
    date: "2024-06-08",
    read: true,
  },
  {
    id: 4,
    title: "New Feature Alert",
    message: "Check out our new feature in your account settings.",
    date: "2024-06-07",
    read: false,
  },
  {
    id: 5,
    title: "Account Update",
    message: "Your account information has been updated.",
    date: "2024-06-06",
    read: true,
  },
  {
    id: 6,
    title: "Subscription Renewal",
    message: "Your subscription will renew on 2024-07-01.",
    date: "2024-06-05",
    read: false,
  },
  {
    id: 7,
    title: "Feedback Request",
    message: "We would love your feedback on our service.",
    date: "2024-06-04",
    read: true,
  },
  {
    id: 8,
    title: "Security Alert",
    message: "A new login was detected from a different device.",
    date: "2024-06-03",
    read: false,
  },
];

function Page() {
  return (
    <div className="w-auto mx-auto py-8 px-4 overflow-y-auto h-dvh">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`rounded-lg shadow-md p-4 border transition
                            ${
                              notif.read
                                ? "bg-white border-gray-200"
                                : "bg-blue-50 border-blue-400"
                            }
                        `}
          >
            <div className="flex justify-between items-center mb-1">
              <span
                className={`text-lg font-semibold ${
                  notif.read ? "text-gray-800" : "text-blue-700"
                }`}
              >
                {notif.title}
              </span>
              {!notif.read && (
                <span className="inline-block bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  New
                </span>
              )}
            </div>
            <div className="text-gray-600 mb-2">{notif.message}</div>
            <div className="text-xs text-gray-400">{notif.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
