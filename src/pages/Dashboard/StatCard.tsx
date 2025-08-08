import React from "react";

type StatColor = "blue" | "yellow" | "green" | "red";

type Props = {
  title: string;
  value: string;
  icon: React.ElementType;
  color: StatColor;
};

const STAT_COLORS: Record<StatColor, string> = {
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
  red: "bg-red-500",
};

export default function StatCard({ title, value, icon: Icon, color }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${STAT_COLORS[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
