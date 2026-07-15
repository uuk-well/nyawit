"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function HarvestChart({ data }: { data: { name: string; berat: number }[] }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
      <h3 className="mb-3 font-semibold text-emerald-800">
        Panen 6 Bulan Terakhir (kg)
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
            <XAxis dataKey="name" stroke="#047857" fontSize={12} />
            <YAxis stroke="#047857" fontSize={12} />
            <Tooltip
              formatter={(value) => [`${value} kg`, "Berat"]}
              contentStyle={{ borderRadius: 12, border: "1px solid #a7f3d0" }}
            />
            <Bar dataKey="berat" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
