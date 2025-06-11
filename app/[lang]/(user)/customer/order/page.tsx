import React from "react";
import Summary from "./summary";
import OrderList from "./order-list";

function page() {
return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <OrderList />
        </div>
        <div>
            <Summary />
        </div>
    </div>
);
}

export default page;
