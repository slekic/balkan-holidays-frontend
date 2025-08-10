import React from 'react';
import { NewPayment } from '../utils/types';
import { PAYMENT_METHODS } from '../utils/constants';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  newPayment: NewPayment;
  onUpdatePayment: (field: keyof NewPayment, value: string) => void;
  onSubmit: () => void;
}

export default function AddPaymentModal({
  isOpen,
  onClose,
  newPayment,
  onUpdatePayment,
  onSubmit
}: AddPaymentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dodaj novu uplatu</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Iznos (€)</label>
              <input
                type="number"
                step="0.01"
                value={newPayment.amount}
                onChange={(e) => onUpdatePayment('amount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Način plaćanja</label>
              <select
                value={newPayment.method}
                onChange={(e) => onUpdatePayment('method', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {PAYMENT_METHODS.map(method => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Komentar</label>
              <textarea
                value={newPayment.comment}
                onChange={(e) => onUpdatePayment('comment', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Beleške o uplati..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Otkaži
            </button>
            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Dodaj uplatu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

