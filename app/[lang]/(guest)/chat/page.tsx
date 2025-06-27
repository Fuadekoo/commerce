"use client";
import React, { useState } from "react";
import Chat from "@/components/chat/adminChat";
import AdminList from "@/components/chat/adminList";
import { getUserByUsername } from "@/actions/admin/chat";
import { Button, Input, Card } from "@heroui/react";

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
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100 bg-opacity-70 z-50">
        <Card className="w-full max-w-sm p-8 shadow-xl border border-blue-200">
          <h2 className="text-xl font-bold mb-4 text-blue-700 text-center">
            Start a Chat
          </h2>
          <Input
            className="mb-2"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleStartChat();
            }}
            color={inputError ? "danger" : "primary"}
            variant="bordered"
          />
          {inputError && (
            <div className="text-danger-500 text-sm mb-2">{inputError}</div>
          )}
          <Button
            color="primary"
            className="w-full font-semibold"
            onClick={handleStartChat}
            size="lg"
          >
            Start Chat
          </Button>
        </Card>
      </div>
    );
  }

  // Step 3: If no admin selected, show AdminList
  if (!chatId) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen">
        <main className="flex-1 p-5 flex flex-col items-center">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 mt-10">
            <h1 className="text-2xl font-bold text-blue-700 mb-4 text-center">
              Contact Admin
            </h1>
            <AdminList onSelectChat={(adminId: string) => setChatId(adminId)} />
          </div>
        </main>
      </div>
    );
  }

  // Step 4: Show Chat with chatId (admin) and guestId
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen">
      <main className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-4 mt-10">
          <Chat chatId={chatId} guestId={guestId} />
        </div>
      </main>
    </div>
  );
}

export default Page;
