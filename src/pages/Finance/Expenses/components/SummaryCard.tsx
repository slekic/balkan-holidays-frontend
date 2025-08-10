import React from "react";
import { ExpenseSummary } from "../utils/types";

interface SummaryCardProps {
  summary: ExpenseSummary;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600">Ukupni troškovi</p>
          <p className="text-2xl font-bold text-gray-900">
            €{summary.totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600">Broj troškova</p>
          <p className="text-2xl font-bold text-gray-900">
            {summary.totalCount}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600">
            Prosečan trošak
          </p>
          <p className="text-2xl font-bold text-gray-900">
            €{summary.averageAmount}
          </p>
        </div>
      </div>
    </div>
  );
};

