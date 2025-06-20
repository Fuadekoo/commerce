"use client";
import React from "react";
import { getNotification } from "@/actions/user/notification";
import useAction from "@/hooks/useAction";

function Page() {
  const [notificationData, , isLoadingNotification] = useAction(
    getNotification,
    [true, () => {}]
  );

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-2 md:px-6 h-dvh bg-gray-50 ">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">
        Notifications
      </h2>
      <div className="overflow-y-auto max-h-[80vh] mb-20">
        {isLoadingNotification ? (
          <div className="flex justify-center items-center py-10 text-gray-500">
            Loading...
          </div>
        ) : (
          <div className="space-y-4">
            {notificationData && notificationData.length > 0 ? (
              notificationData.map((notif) => (
                <div
                  key={notif.id}
                  className={`rounded-xl shadow p-4 border transition-all ${
                    notif.isRead
                      ? "bg-white border-gray-200"
                      : "bg-blue-50 border-blue-400"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 gap-2">
                    <span
                      className={`text-base md:text-lg font-semibold ${
                        notif.isRead ? "text-gray-800" : "text-blue-700"
                      }`}
                    >
                      Notification
                    </span>
                    {!notif.isRead && (
                      <span className="inline-block bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 mb-2 break-words">
                    {notif.content}
                  </div>
                  <div className="text-xs text-gray-400 text-right">
                    {notif.createdAt
                      ? new Date(notif.createdAt).toLocaleString()
                      : ""}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-10">
                No notifications found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
