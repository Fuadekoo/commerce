"use client";
import Image from "next/image";
import ChatWriteCard from "./chatWriteCard";
import React, { useEffect, useRef, useState } from "react";
// import { getUserByUsername } from "@/actions/admin/chat";
// import { getLoginUserId } from "@/actions/admin/chat";
import useAction from "@/hooks/useAction";
import { getUserChat } from "@/actions/admin/chat";
import { io, Socket } from "socket.io-client";

type ChatMessage = {
  id: string;
  fromUserId: string;
  toUserId: string;
  msg: string;
  createdAt: Date;
  self?: boolean;
};

type ChatProps = {
  chatId: string;
  guestId: string;
};

function Chat({ chatId, guestId }: ChatProps) {
  // Use guestId as currentUserId in guest mode
  const currentUserId = guestId;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Always call the hook
  const [userData, , userLoading] = useAction(
    getUserChat,
    [true, () => {}],
    chatId
  );

  // Initialize socket connection
  useEffect(() => {
    if (!currentUserId) return;

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
        // type === "user" && // Removed type check, always user
        (newMsg.fromUserId === chatId && newMsg.toUserId === currentUserId) ||
        (newMsg.fromUserId === currentUserId && newMsg.toUserId === chatId)
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
  }, [currentUserId, chatId]);

  // Set initial messages when data loads
  useEffect(() => {
    // if (type === "user" && userData) { // Removed type check
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
    if (!socket || !message.trim() || !currentUserId) return;

    const now = new Date();
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2), // temp id
        fromUserId: currentUserId,
        toUserId: chatId,
        msg: message,
        createdAt: now,
        self: true,
      },
    ]);
    socket.emit("msg", {
      id: chatId,
      msg: message,
      fromUserId: currentUserId,
    });
  };

  const loading = userLoading;

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-blue-50 overflow-hidden">
        <div className="flex items-center gap-3 overflow-hidden">
          <button className="md:hidden text-blue-500 text-xl font-bold px-2 overflow-hidden">
            &lt;
          </button>
          <Image
            src="/ai.png"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full object-cover border"
          />
          <div>
            <div className="font-semibold text-gray-800">{/* User Name */}</div>
            <div className="text-xs text-gray-500">Online</div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-blue-500 text-xl">⋮</button>
      </div>

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
      <div className="border-t bg-white px-4 py-3 overflow-hidden">
        <ChatWriteCard onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default Chat;
