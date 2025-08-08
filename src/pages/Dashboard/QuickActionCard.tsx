import React from "react";
import { Link } from "react-router-dom";

type ActionColor = "blue" | "green" | "purple" | "orange";

type Props = {
  title: string;
  description: string;
  icon: React.ElementType;
  color: ActionColor;
  path: string;
};

const ACTION_COLORS: Record<ActionColor, string> = {
  blue: "border-blue-300 hover:border-blue-500 hover:bg-blue-50 group-hover:text-blue-700",
  green:
    "border-green-300 hover:border-green-500 hover:bg-green-50 group-hover:text-green-700",
  purple:
    "border-purple-300 hover:border-purple-500 hover:bg-purple-50 group-hover:text-purple-700",
  orange:
    "border-orange-300 hover:border-orange-500 hover:bg-orange-50 group-hover:text-orange-700",
};

const ICON_COLORS: Record<ActionColor, string> = {
  blue: "text-gray-400 group-hover:text-blue-500",
  green: "text-gray-400 group-hover:text-green-500",
  purple: "text-gray-400 group-hover:text-purple-500",
  orange: "text-gray-400 group-hover:text-orange-500",
};

export default function QuickActionCard({
  title,
  description,
  icon: Icon,
  color,
  path,
}: Props) {
  return (
    <Link
      to={path}
      className={`p-4 border-2 border-dashed rounded-lg transition-colors group ${ACTION_COLORS[color]}`}
    >
      <div className="flex justify-center items-center h-12 mb-3">
        <Icon className={`w-8 h-8 ${ICON_COLORS[color]}`} />
      </div>
      <p className="text-sm font-medium text-gray-700 mb-1 text-center">
        {title}
      </p>
      <p className="text-xs text-gray-500 text-center">{description}</p>
    </Link>
  );
}
