"use client";
import React, { useEffect, useState } from "react";
import { getNotification } from "@/actions/user/notification";
import useAction from "@/hooks/useAction";
type Notification = {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
};

function Page() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      try {
        const data = await getNotification();
        setNotifications(data);
      } catch (error) {
        // handle error if needed
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  return (
    <div className="w-auto mx-auto py-8 px-4 overflow-y-auto h-dvh">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
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
      )}
    </div>
  );
}

export default Page;
