"use client";
import ChatWriteCard from "./chatWriteCard";
import React, { useEffect, useRef, useState } from "react";
import useAction from "@/hooks/useAction";
import { getChatToAdmin } from "@/actions/guest/chat";
import io, { Socket } from "socket.io-client";
// import { io } from "socket.io-client";

type ChatMessage = {
  id: string;
  fromUserId: string;
  toUserId: string;
  msg: string;
  createdAt: Date;
  self?: boolean;
};

type ChatProps = {
  chatId: string; // admin user id
  guestId: string; // guest user id
};

function Chat({ chatId, guestId }: ChatProps) {
  const currentUserId = guestId;
  const adminId = chatId;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<typeof Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Always call the hook with both ids if needed
  const [userData, , userLoading] = useAction(
    getChatToAdmin,
    [true, () => {}],
    adminId
  );

  // Initialize socket connection
  useEffect(() => {
    if (!currentUserId || !adminId) return;

    const newSocket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000",
      {
        auth: { id: currentUserId },
      }
    );

    setSocket(newSocket);

    // Handle incoming direct messages
    const handleMsg = (newMsg: ChatMessage) => {
      if (
        (newMsg.fromUserId === adminId && newMsg.toUserId === currentUserId) ||
        (newMsg.fromUserId === currentUserId && newMsg.toUserId === adminId)
      ) {
        setMessages((prev) => [
          ...prev,
          { ...newMsg, self: newMsg.fromUserId === currentUserId },
        ]);
      }
    };

    newSocket.on("msg", handleMsg);

    return () => {
      newSocket.off("msg", handleMsg);
      newSocket.disconnect();
    };
  }, [currentUserId, adminId]);

  // Set initial messages when data loads
  useEffect(() => {
    if (userData) {
      setMessages(
        (userData as ChatMessage[]).map((msg) => ({
          ...msg,
          self: msg.fromUserId === currentUserId,
        }))
      );
    }
  }, [userData, currentUserId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Optimistically add message to UI and emit to server
  const handleSendMessage = (message: string) => {
    if (!socket || !message.trim() || !currentUserId || !chatId) return;

    // Optimistically add the message to the UI
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2), // Temporary id
        fromUserId: currentUserId,
        toUserId: chatId,
        msg: message,
        createdAt: new Date(),
        self: true,
      },
    ]);

    // Emit to server
    socket.emit("msg", {
      id: chatId,
      msg: message,
      fromUserId: currentUserId,
      toUserId: chatId,
    });
  };

  const loading = userLoading;

  return (
    <div className="h-svh flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.self ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                  msg.self
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 border rounded-bl-none"
                }`}
              >
                <div>{msg.msg}</div>
                <div
                  className={`text-xs mt-1 ${
                    msg.self ? "text-blue-100" : "text-gray-500"
                  } text-right`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">No messages yet.</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-gray-100 px-4 py-3 overflow-hidden">
        <ChatWriteCard onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default Chat;
