import React from 'react';
import { PaymentOffer } from '../utils/types';
import { formatCurrency, formatDate } from '../utils/helpers';

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: PaymentOffer | null;
}

export default function PaymentHistoryModal({
  isOpen,
  onClose,
  offer
}: PaymentHistoryModalProps) {
  if (!isOpen || !offer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Istorija uplata</h3>
          <p className="text-sm text-gray-600 mt-1">{offer.name} - {offer.code}</p>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {offer.payments.length ? (
            <div className="space-y-4">
              {offer.payments.map((payment) => (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-green-600">{formatCurrency(payment.amount)}</span>
                    <span className="text-sm text-gray-500">{formatDate(payment.date)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{payment.comment}</p>
                  <p className="text-xs text-gray-500">Metod: {payment.method}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Još uvek nema zabeleženih uplata</p>
          )}
        </div>
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Zatvori
          </button>
        </div>
      </div>
    </div>
  );
}

