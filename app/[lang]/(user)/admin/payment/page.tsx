import React from "react";
import PaymentListPage from "./payment-list";

function Page() {
  return (
    <div className="h-dvh gap-5 flex flex-col overflow-y-auto mb-2">
      <PaymentListPage />
    </div>
  );
}

export default Page;
