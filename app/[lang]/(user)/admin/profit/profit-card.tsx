import React from "react";
import { Button } from "@heroui/react"; // Assuming you use HeroUI buttons, adjust if not
import { getProfitCards } from "@/actions/admin/profitCards";
import useAction from "@/hooks/useAction";
import CustomTable from "@/components/custom-table";
import { Search } from "lucide-react";
import page from "../../customer/order/page";

function ProfitCard() {
  const [Search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [data, refresh, isLoading] = useAction(
    getProfitCards,
    [true, () => {}],
    Search,
    page,
    pageSize
  );

  return (
    <div>
      <h1>Profit Cards</h1>
      <CustomTable
        data={data}
        isLoading={isLoading}
        columns={[
          { key: "id", label: "ID" },
          { key: "orderNumber", label: "Order Number" },
          { key: "profit", label: "Profit" },
          { key: "priceDifference", label: "Price Difference" },
          { key: "user.username", label: "User" },
        ]}
      />
    </div>
  );
}

export default ProfitCard;
