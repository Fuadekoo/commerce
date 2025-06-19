import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useAction from "@/hooks/useAction";
import { FindUser } from "@/actions/admin/chat";
import { Input, Button } from "@heroui/react";

type NewChatProps = {
  onFinish: () => void;
  onSelectChat?: (chatId: string, type: "user") => void;
};

function NewChat({ onFinish, onSelectChat }: NewChatProps) {
  const [response, action, isLoading] = useAction(FindUser, [
    ,
    (data) => {
      if (data) {
        // onFinish();
      }
    },
  ]);
  const {
    handleSubmit,
    register,
    formState: {},
  } = useForm({
    resolver: zodResolver(
      z.object({
        phone: z
          .string()
          .min(1, "Phone number is required")
          .max(15, "Phone number is too long"),
      })
    ),
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[100px]">
      <div>
        <h2 className="text-xl font-bold mb-4">Start New Chat</h2>
        <form
          onSubmit={handleSubmit((data) => action(data.phone))}
          className="w-full max-w-xs"
        >
          <label htmlFor="">enter phone number</label>
          <Input
            type="text"
            {...register("phone")}
            placeholder="Enter user phone"
            required
          />
          <Button type="submit" disabled={isLoading}>
            find person
          </Button>
        </form>
      </div>
      <div>
        <p className="text-sm text-gray-500 mt-2">Person</p>
        {response ? (
          <div className="mt-2 text-green-600 text-sm">
            <button
              className="mt-2 text-blue-600 text-sm underline"
              onClick={() => {
                onSelectChat && onSelectChat(response.id, "user");
                onFinish();
              }}
            >
              {response.username} ({response.phone})
            </button>
            {/* {typeof response === "string"
              ? response
              : JSON.stringify(response)} */}
          </div>
        ) : (
          <div className="mt-2 text-red-600 text-sm">No user found</div>
        )}
      </div>
    </div>
  );
}

export default NewChat;
