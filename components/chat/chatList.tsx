"use client";
import React, { useRef, useState } from "react";
import UserList from "./userList";
import NewChat from "./newChat";

type ChatListProps = {
  onSelectChat?: (chatId: string, type: "user") => void;
};

function ChatList({ onSelectChat }: ChatListProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showPopup, setShowPopup] = useState(false);

  // Close popup after action
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Handle finish for NewChat
  const handleFinish = () => {
    handleClosePopup();
  };

  // Optional: close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="relative w-full h-screen bg-gray-100 border-r p-2 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Chats</h1>
        <div className="relative" ref={dropdownRef}>
          <button
            className="p-2 bg-blue-500 text-white rounded hover:bg-pink-500"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            New Chat
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                onClick={() => {
                  setShowPopup(true);
                  setShowDropdown(false);
                }}
              >
                New User Chat
              </button>
            </div>
          )}
        </div>
      </div>
      {/* List */}
      <div className="overflow-y-auto">
        <UserList onSelectChat={onSelectChat} />
      </div>

      {/* full page popup over ChatList only */}
      {showPopup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* No dark background, just a little blur */}
          <div className="absolute inset-0 backdrop-blur-sm pointer-events-none" />
          {/* Popup content */}
          <div
            className="relative w-full max-w-md mx-auto p-6 pointer-events-auto"
            style={{
              background: "rgba(255,255,255,0.3)",
              backdropFilter: "blur(16px)",
              borderRadius: "1rem",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={handleClosePopup}
            >
              &times;
            </button>
            <NewChat onFinish={handleFinish} onSelectChat={onSelectChat!} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatList;
