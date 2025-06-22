"use client";
import React, { useState } from "react";
import Chat from "@/components/chat/adminChat";
import AdminList from "@/components/chat/adminList";
import { getUserByUsername } from "@/actions/admin/chat";

function Page() {
  const [showPopup, setShowPopup] = useState(true);
  const [username, setUsername] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  // Step 1: Handle username submit and get guestId
  const handleStartChat = async () => {
    setInputError(null);
    if (!username.trim()) {
      setInputError("Username is required");
      return;
    }
    try {
      const user = await getUserByUsername(username.trim());
      if (!user || !user.id) {
        setInputError("User not found");
        return;
      }
      setGuestId(user.id);
      setShowPopup(false);
    } catch (e) {
      console.error("Error fetching user:", e);
      setInputError("Error fetching user");
    }
  };

  // Step 2: Show popup until guestId is set
  if (showPopup || !guestId) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-blur bg-opacity-40 z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
          <h2 className="text-lg font-bold mb-4">
            Enter your username to start chat
          </h2>
          <input
            className="w-full border rounded px-3 py-2 mb-2"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleStartChat();
            }}
          />
          {inputError && (
            <div className="text-red-500 text-sm mb-2">{inputError}</div>
          )}
          <button
            className="w-full bg-blue-500 text-white rounded py-2 font-semibold"
            onClick={handleStartChat}
          >
            Start Chat
          </button>
        </div>
      </div>
    );
  }

  // Step 3: If no admin selected, show AdminList
  if (!chatId) {
    return (
      <div className="overflow-hidden h-screen">
        {/* <h1>Contact Admin</h1> */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-hidden">
            <AdminList onSelectChat={(adminId: string) => setChatId(adminId)} />
          </div>
        </main>
      </div>
    );
  }

  // Step 4: Show Chat with chatId (admin) and guestId
  return (
    <div className="overflow-hidden h-screen">
      {/* <h1>Contact Admin</h1> */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-hidden">
          <Chat chatId={chatId} guestId={guestId} />
        </div>
      </main>
    </div>
  );
}

export default Page;
