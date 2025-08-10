import React from "react";
import { AlertTriangle } from "lucide-react";

interface CriticalDebtsAlertProps {
  criticalDebtsCount: number;
}

export default function CriticalDebtsAlert({ criticalDebtsCount }: CriticalDebtsAlertProps) {
  if (criticalDebtsCount === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-red-800">
            Upozorenje na kritična plaćanja
          </h3>
          <p className="text-sm text-red-700 mt-1">
            Imate {criticalDebtsCount} ponuda{criticalDebtsCount !== 1 ? "s" : ""} sa
            kritičnim statusom plaćanja koje zahtevaju hitnu pažnju.
          </p>
        </div>
      </div>
    </div>
  );
}
