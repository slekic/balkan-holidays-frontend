import React from "react";
import { Download } from "lucide-react";

interface HeaderProps {
  onExportToExcel: () => void;
}

export default function Header({ onExportToExcel }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Neizmirena dugovanja
        </h1>
        <p className="text-gray-600 mt-1">
          Prati i upravljaj neplaćenim iznosima od klijenata
        </p>
      </div>
      <button
        onClick={onExportToExcel}
        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <Download className="w-4 h-4 mr-2" />
        Izvezi u Excel
      </button>
    </div>
  );
}
