import React from "react";
import { Download, Clock } from "lucide-react";

interface PageHeaderProps {
  onExport: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ onExport }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Ponude za praćenje
        </h1>
        <p className="text-gray-600 mt-1 flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          Ponude koje zahtevaju follow-up akciju
        </p>
      </div>
    </div>
  );
};
