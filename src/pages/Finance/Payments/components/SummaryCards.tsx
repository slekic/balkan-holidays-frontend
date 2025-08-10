import React from 'react';
import { Euro, CreditCard, History } from 'lucide-react';
import { PaymentOffer } from '../utils/types';
import { calculatePaymentStats } from '../utils/helpers';

interface SummaryCardsProps {
  offers: PaymentOffer[];
}

export default function SummaryCards({ offers }: SummaryCardsProps) {
  const { totalReceivable, totalReceived, totalOutstanding, collectionRate } = calculatePaymentStats(offers);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Ukupno za naplatu</p>
            <p className="text-2xl font-bold text-gray-900">€{totalReceivable.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-full bg-blue-100">
            <Euro className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Ukupno primljeno</p>
            <p className="text-2xl font-bold text-green-600">€{totalReceived.toLocaleString()}</p>
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
            <p className="text-2xl font-bold text-red-600">€{totalOutstanding.toLocaleString()}</p>
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
            <p className="text-2xl font-bold text-gray-900">{collectionRate}%</p>
          </div>
          <div className="p-3 rounded-full bg-purple-100">
            <History className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
