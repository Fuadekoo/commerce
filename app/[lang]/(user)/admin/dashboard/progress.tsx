"use client";
import React from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

const data = [
  { name: "Completed", value: 60, color: "#047221" },
  { name: "In Progress", value: 30, color: "#96F093" },
  { name: "Pending", value: 10, color: "#CEF7C8" },
];

function Progress() {
  return (
    <div className="flex flex-col items-center">
      {/* <h1 className="text-lg font-semibold">Progress Overview</h1> */}
      <PieChart width={300} height={300}>
        <Pie
          className="rounded"
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={data}
          cx="50%"
          cy="70%"
          innerRadius={70}
          outerRadius={100}
          stroke="none"
          paddingAngle={3}
          labelLine={false}
          label={({ cx, cy }) => (
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={20}
              fontWeight="bold"
              fill="#333"
            >
              {`${data[0].name}: ${data[0].value}%`}
            </text>
          )}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
      {/* <div className="mt-4 text-center">
        {data.map((entry) => (
          <p
            key={entry.name}
            className="text-lg font-semibold"
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div> */}
    </div>
  );
}

export default Progress;
