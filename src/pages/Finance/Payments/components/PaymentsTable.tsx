import React from 'react';
import { Users, Plus, History } from 'lucide-react';
import { PaymentOffer } from '../utils/types';
import { getPaymentStatusColor, getPaymentProgressColor } from '../utils/constants';
import { calculatePaymentPercentage, calculateRemainingAmount, formatCurrency, formatDate } from '../utils/helpers';

interface PaymentsTableProps {
  offers: PaymentOffer[];
  onAddPayment: (offerId: string) => void;
  onViewPaymentHistory: (offerId: string) => void;
}

export default function PaymentsTable({ 
  offers, 
  onAddPayment, 
  onViewPaymentHistory 
}: PaymentsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Ponuda</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Klijent</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Ukupan iznos</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Plaćeno</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Napredak</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => {
              const paymentPercentage = calculatePaymentPercentage(offer.totalPaid, offer.totalPrice);
              const remaining = calculateRemainingAmount(offer.totalPrice, offer.totalPaid);
              
              return (
                <tr key={offer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{offer.code}</p>
                      <p className="text-sm text-gray-600">{offer.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{offer.client}</p>
                        <p className="text-xs text-gray-500">{offer.numberOfPersons} persons</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-900">{formatCurrency(offer.totalPrice)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <span className="font-semibold text-green-600">{formatCurrency(offer.totalPaid)}</span>
                      {remaining > 0 && (
                        <p className="text-xs text-red-600">Preostalo: {formatCurrency(remaining)}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{Math.round(paymentPercentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getPaymentProgressColor(paymentPercentage)}`}
                          style={{ width: `${paymentPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(offer.paymentStatus)}`}>
                      {offer.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onAddPayment(offer.id)}
                        className="flex items-center px-2 py-1 text-green-600 hover:bg-green-50 rounded text-sm transition-colors"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Dodaj uplatu
                      </button>
                      <button
                        onClick={() => onViewPaymentHistory(offer.id)}
                        className="flex items-center px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm transition-colors"
                      >
                        <History className="w-3 h-3 mr-1" />
                        Istorija
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

