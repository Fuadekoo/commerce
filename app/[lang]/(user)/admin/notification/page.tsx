"use client";
import React, { useState } from "react";
import useAction from "@/hooks/useAction";
import {
  createNotification,
  getNotifications,
  deleteNotification,
  updateNotification,
} from "@/actions/admin/notification";
import { Button, Textarea } from "@heroui/react";
import { Loader2, Trash2, Edit2, Save, X } from "lucide-react";
import { addToast } from "@heroui/toast";
// import { productSchema } from "@/lib/zodSchema";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";

function Page() {
  const [notifications, refreshNotifications, isLoading] = useAction(
    getNotifications,
    [true, () => {}]
  );

  const [createResponse, createAction] = useAction(createNotification, [
    ,
    (res) => {
      addToast({
        title: res?.message ? "Posted" : "Error",
        description: res?.message || "Post failed",
      });
      setShowModal(false);
      setNewMessage("");
      refreshNotifications();
    },
  ]);
  const [, deleteAction] = useAction(deleteNotification, [
    ,
    (res) => {
      addToast({
        title: res?.message ? "Deleted" : "Error",
        description: res?.message || "Delete failed",
      });
      refreshNotifications();
    },
  ]);
  const [, updateAction] = useAction(updateNotification, [
    ,
    (res) => {
      addToast({
        title: res?.message ? "Updated" : "Error",
        description: res?.message || "Update failed",
      });
      setEditId(null);
      refreshNotifications();
    },
  ]);

  const [editId, setEditId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");

  // Popup state
  const [showModal, setShowModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const handleEdit = (id: string, content: string) => {
    setEditId(id);
    setEditContent(content);
  };

  const handleUpdate = (id: string) => {
    updateAction(id, editContent);
  };

  // Handle create notification
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createAction(newMessage);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 md:mt-10 bg-white p-3 md:p-6 rounded-xl shadow h-svh md:h-auto overflow-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Post Messages
        </h1>
        <Button
          color="primary"
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto"
        >
          Post
        </Button>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-2 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md">
            <h2 className="text-base md:text-lg font-semibold mb-4">
              New Message
            </h2>
            <form onSubmit={handleCreate}>
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Enter your message"
                className="mb-4"
                required
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="flat"
                  onClick={() => {
                    setShowModal(false);
                    setNewMessage("");
                  }}
                  className="w-full md:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  // loading={isCreating}
                  disabled={!newMessage.trim()}
                  className="w-full md:w-auto"
                >
                  Post
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin mr-2" /> Loading...
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {notifications && notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                className="border rounded-lg p-3 md:p-4 flex flex-col gap-2 bg-gray-50"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      color="danger"
                      // loading={isDeleting}
                      onClick={() => deleteAction(n.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {editId === n.id ? (
                      <>
                        <Button
                          size="sm"
                          variant="flat"
                          color="primary"
                          // loading={isUpdating}
                          onClick={() => handleUpdate(n.id)}
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          onClick={() => setEditId(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="flat"
                        onClick={() => handleEdit(n.id, n.content)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {editId === n.id ? (
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                ) : (
                  <div className="text-gray-700 break-words">{n.content}</div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-10">
              No messages found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Page;
