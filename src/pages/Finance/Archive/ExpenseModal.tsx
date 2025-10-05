import React from "react";
import { X, Euro, Upload, Trash2 } from "lucide-react";
import { ExpenseEntry } from "../../../types/offer";

type Props = {
  open: boolean;
  offerId: string | null;
  onClose: () => void;
  expenses: ExpenseEntry[];
  handleAddExpense: () => void;
  handleUpdateExpense: (id: string, updates: Partial<ExpenseEntry>) => void;
  handleRemoveExpense: (id: string) => void;
  saveExpenses: () => void;
};

export default function FinanceExpensesModal({
  open,
  offerId,
  onClose,
  expenses,
  handleAddExpense,
  handleUpdateExpense,
  handleRemoveExpense,
  saveExpenses,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Rashodi ponude</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="border p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>{expense.entityName || "Naziv troška"}</span>
                <button onClick={() => handleRemoveExpense(expense.id)} className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={expense.entityName}
                  onChange={(e) => handleUpdateExpense(expense.id, { entityName: e.target.value })}
                  placeholder="Naziv troška"
                  className="border rounded px-2 py-1"
                />
                <div className="relative">
                  <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={expense.costAmount || ""}
                    onChange={(e) => handleUpdateExpense(expense.id, { costAmount: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="border rounded px-7 py-1 w-full"
                  />
                </div>
                <input
                  type="text"
                  value={expense.comment}
                  onChange={(e) => handleUpdateExpense(expense.id, { comment: e.target.value })}
                  placeholder="Komentar"
                  className="border rounded px-2 py-1"
                />
              </div>
            </div>
          ))}
          <button onClick={handleAddExpense} className="px-4 py-2 bg-blue-50 text-blue-600 rounded">
            Dodaj rashod
          </button>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 space-x-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">Otkaži</button>
          <button onClick={saveExpenses} className="px-4 py-2 bg-blue-600 text-white rounded">Sačuvaj</button>
        </div>
      </div>
    </div>
  );
}
