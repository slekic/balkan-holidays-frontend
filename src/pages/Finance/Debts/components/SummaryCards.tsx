import React from "react";
import { Euro, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { DebtSummary } from "../utils/types";

interface SummaryCardsProps {
  summary: DebtSummary;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Ukupno dugovanje
            </p>
            <p className="text-2xl font-bold text-red-600">
              €{summary.totalOutstanding.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-full bg-red-100">
            <Euro className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Kritična dugovanja
            </p>
            <p className="text-2xl font-bold text-red-600">
              {summary.criticalDebts}
            </p>
          </div>
          <div className="p-3 rounded-full bg-red-100">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Prosečno dugovanje
            </p>
            <p className="text-2xl font-bold text-gray-900">
              €{Math.round(summary.averageDebt).toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-full bg-blue-100">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Stopa naplate</p>
            <p className="text-2xl font-bold text-gray-900">
              {summary.collectionRate}%
            </p>
          </div>
          <div className="p-3 rounded-full bg-green-100">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

