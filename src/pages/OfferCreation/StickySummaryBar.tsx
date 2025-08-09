import React from "react";
import { DollarSign, Download, FileText, Save } from "lucide-react";

type Props = {
  totalOfferCost: number;
  pricePerPerson: number;
  numberOfPersons: number;
  onOpenExpenses: () => void;
  onExportExcel: () => void;
  onOpenPDF: () => void;
  onSave: () => void;
};

export default function StickySummaryBar({ totalOfferCost, pricePerPerson, numberOfPersons, onOpenExpenses, onExportExcel, onOpenPDF, onSave }: Props) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg mt-8">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <p className="text-sm text-gray-600">Ukupna cena ponude</p>
              <p className="text-2xl font-bold text-gray-900">€{totalOfferCost.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Cena po osobi</p>
              <p className="text-xl font-semibold text-blue-600">€{pricePerPerson.toFixed(2)}</p>
            </div>
            {numberOfPersons > 0 && (
              <div className="text-center">
                <p className="text-sm text-gray-600">Broj osoba</p>
                <p className="text-lg font-medium text-gray-700">{numberOfPersons}</p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={onOpenExpenses} className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <DollarSign className="w-4 h-4 mr-2" />
              Rashodi
            </button>
            <button onClick={onExportExcel} className="flex items-center px-4 py-2 text-green-700 border border-green-300 rounded-lg hover:bg-green-50 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </button>
            <button onClick={onOpenPDF} className="flex items-center px-4 py-2 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </button>
            <button onClick={onSave} className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <Save className="w-4 h-4 mr-2" />
              Sačuvaj ponudu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


