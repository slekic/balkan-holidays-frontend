import React from 'react';
import { Euro, CreditCard, History } from 'lucide-react';
import { PaymentSummary } from '../utils/types';
import { calculatePaymentStats } from '../utils/helpers';

interface SummaryCardsProps {
  summary: PaymentSummary;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Ukupan prihod</p>
            <p className="text-2xl font-bold text-green-600">€{summary.totalReceived.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-full bg-green-100">
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Preostalo za naplatu</p>
            <p className="text-2xl font-bold text-red-600">€{summary.totalOutstanding.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-full bg-red-100">
            <Euro className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Stopa naplate</p>
            <p className="text-2xl font-bold text-gray-900">{summary.collectionRate}%</p>
          </div>
          <div className="p-3 rounded-full bg-purple-100">
            <History className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

