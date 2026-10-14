"use client";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

export default function Sparkline({ data, color = "#38bdf8" }: { data: number[]; color?: string }) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
