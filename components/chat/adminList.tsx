"use client";
import React from "react";
import useAction from "@/hooks/useAction";
import { getAdminList } from "@/actions/guest/chat";
import Loading from "@/components/loading";

type UserListProps = {
  onSelectChat?: (chatId: string, type: "user") => void;
};

function UserList({ onSelectChat }: UserListProps) {
  const [search, setSearch] = React.useState("");
  const [data, , loading] = useAction(getAdminList, [true, () => {}], search);
  return (
    <div className="overflow-hidden">
      {/* Search Box */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search or start new chat"
        className="w-full p-2 rounded-4xl border mb-4"
      />
      {/* User List */}
      <div className="overflow-y-auto">
        {loading || data === undefined ? (
          <div className="p-3 mt-10 text-center">
            <Loading />
          </div>
        ) : (
          data.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat && onSelectChat(chat.id, "user")}
              className="p-3 border-b flex justify-between items-center cursor-pointer hover:bg-gray-200 rounded"
            >
              <div>
                <p className="font-semibold">{chat.username}</p>
                <p className="text-sm text-gray-500">
                  {chat.phone || "No recent messages"}
                </p>
              </div>
              <span className="text-xs text-gray-400">{chat.socket}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserList;
