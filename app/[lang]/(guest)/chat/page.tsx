"use client";
import React, { useState } from "react";
import ChatList from "@/components/chat/chatList";
import Chat from "@/components/chat/chat";
// import ChatNavbar from "@/components/chat/chatNavbar";

function Page() {
  const [selectedChat, setSelectedChat] = useState<string | undefined>();
  const [selectedType, setSelectedType] = useState<"user">("user");

  const handleSelectChat = (chatId: string, type: "user") => {
    setSelectedChat(chatId);
    // setSelectedType(type);
  };

  return (
    <div className="overflow-hidden h-screen">
      <h1>Contact Admin</h1>
      {/* <nav className=" sticky overflow-hidden flex-shrink-0">
        <ChatNavbar />
      </nav> */}
      <main className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-0 h-full overflow-hidden">
          <div
            className={`${
              selectedChat ? "hidden" : "block"
            } md:block h-full overflow-y-auto`}
          >
            <ChatList onSelectChat={handleSelectChat} />
          </div>
          <div
            className={`${
              selectedChat ? "block" : "hidden"
            } md:block h-full overflow-y-auto`}
          >
            {selectedChat && <Chat chatId={selectedChat} />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Page;
