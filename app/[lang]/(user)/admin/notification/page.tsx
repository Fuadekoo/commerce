import React from "react";
import useAction from "@/hooks/useAction";
import {
  getNotifications,
  deleteNotification,
  updateNotification,
} from "@/actions/admin/notification";
function Page() {
  const [notifications, setNotifications, isLoading] = useAction(
    getNotifications,
    [true, () => {}]
  );

  return (
    <div>
      <h1>hello</h1>
    </div>
  );
}

export default Page;
