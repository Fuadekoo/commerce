"use client";
import React from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const data = [
  { name: "Shampoo", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Soap", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Detergent", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Clothes", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Trousers", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Toothpaste", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Toothbrush", uv: 3490, pv: 4300, amt: 2100 },
  { name: "Face Wash", uv: 2100, pv: 3200, amt: 1800 },
  { name: "Body Lotion", uv: 1800, pv: 2700, amt: 1700 },
  { name: "Hand Sanitizer", uv: 1600, pv: 2500, amt: 1500 },
];

export default function UserStat() {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="uv" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
