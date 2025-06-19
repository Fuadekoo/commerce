"use client";
import React, { useState } from "react";
import ChatList from "@/components/chat/chatList";
import Chat from "@/components/chat/chat";

function Page() {
    const [selectedChat, setSelectedChat] = useState<string | undefined>();

    // Handler receives only chatId now
    const handleSelectChat = (chatId: string) => {
        setSelectedChat(chatId);
    };

    return (
        <div className="overflow-hidden h-screen">
            <main className="flex-1 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-0 h-full overflow-hidden">
                    <div
                        className={`${
                            selectedChat ? "hidden" : "block"
                        } md:block h-full overflow-y-auto`}
                    >
                        {/* Pass the handler to ChatList */}
                        <ChatList onSelectChat={handleSelectChat} />
                    </div>
                    <div
                        className={`${
                            selectedChat ? "block" : "hidden"
                        } md:block h-full overflow-y-auto`}
                    >
                        {selectedChat && (
                            <Chat
                                chatId={selectedChat}
                                // currentUserId={"yourCurrentUserId"} // Replace with actual user id
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Page;
