import React from "react";
import { Download } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  showExportButton?: boolean;
  exportButtonText?: string;
  onExport?: () => void;
}

export default function PageHeader({
  title,
  description,
  showExportButton = true,
  exportButtonText = "Izvezi u Excel",
  onExport
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
      {showExportButton && (
        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          {exportButtonText}
        </button>
      )}
    </div>
  );
}
