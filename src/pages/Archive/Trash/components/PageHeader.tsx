import React from "react";
import { Download, Trash2 } from "lucide-react";

interface PageHeaderProps {
  onExport: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ onExport }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Korpa za brisanje
        </h1>
        <p className="text-gray-600 mt-1 flex items-center">
          <Trash2 className="w-4 h-4 mr-2" />
          Obrisane ponude - možete ih vratiti ili trajno obrisati
        </p>
      </div>
      <button 
        onClick={onExport}
        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <Download className="w-4 h-4 mr-2" />
        Izvezi u Excel
      </button>
    </div>
  );
};
