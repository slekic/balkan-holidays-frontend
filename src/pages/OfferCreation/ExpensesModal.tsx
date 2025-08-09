import React from "react";
import { ExpenseEntry } from "../../types/offer";
import { Euro, Upload, X, Trash2 } from "lucide-react";
import { getEntityTypeColor } from "./utils/constants";

type Props = {
  open: boolean;
  onClose: () => void;
  detectedEntities: ExpenseEntry[];
  updateDetectedEntity: (id: string, updates: Partial<ExpenseEntry>) => void;
  expenses: ExpenseEntry[];
  onAddCustomExpense: () => void;
  onUpdateExpense: (id: string, updates: Partial<ExpenseEntry>) => void;
  onRemoveExpense: (id: string) => void;
};

export default function ExpensesModal({
  open,
  onClose,
  detectedEntities,
  updateDetectedEntity,
  expenses,
  onAddCustomExpense,
  onUpdateExpense,
  onRemoveExpense,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Troškovi ponude
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Interno praćenje troškova za ovu ponudu
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">
                Detektovani entiteti iz ponude
              </h4>
              <p className="text-sm text-blue-700">
                Ovi entiteti su automatski detektovani iz trenutne konfiguracije
                ponude
              </p>
            </div>

            <div className="space-y-4">
              {detectedEntities.map((entity) => (
                <div
                  key={entity.id}
                  className="bg-blue-25 border border-blue-100 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEntityTypeColor(
                          entity.entityType
                        )}`}
                      >
                        {entity.entityType.charAt(0).toUpperCase() +
                          entity.entityType.slice(1)}
                      </span>
                      <span className="font-medium text-gray-900">
                        {entity.entityName}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Iznos troška (€)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          €
                        </span>
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={entity.costAmount || ""}
                          onChange={(e) =>
                            updateDetectedEntity(entity.id, {
                              costAmount: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Komentar
                      </label>
                      <input
                        type="text"
                        value={entity.comment}
                        onChange={(e) =>
                          updateDetectedEntity(entity.id, {
                            comment: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Interna napomena..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Otpremi fakturu/račun
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file)
                              updateDetectedEntity(entity.id, {
                                uploadedFile: file,
                              });
                          }}
                          className="flex-1 text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {entity.uploadedFile && (
                          <button
                            type="button"
                            onClick={() =>
                              updateDetectedEntity(entity.id, {
                                uploadedFile: undefined,
                              })
                            }
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {entity.uploadedFile && (
                        <p className="text-xs text-gray-600 mt-1">
                          {entity.uploadedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Ostali troškovi
              </h4>
              <p className="text-sm text-gray-600">
                Dodaj posebne troškove koji nisu direktno povezani sa entitetima
                ponude
              </p>
            </div>

            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-gray-25 border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEntityTypeColor(
                          expense.entityType
                        )}`}
                      >
                        {expense.entityType.charAt(0).toUpperCase() +
                          expense.entityType.slice(1)}
                      </span>
                      <span className="font-medium text-gray-900">
                        {expense.entityName}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveExpense(expense.id)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Naziv troška
                      </label>
                      <input
                        type="text"
                        value={expense.entityName}
                        onChange={(e) =>
                          onUpdateExpense(expense.id, {
                            entityName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Unesite naziv troška"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cena troška (€)
                      </label>
                      <div className="relative">
                        <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={expense.costAmount || ""}
                          onChange={(e) =>
                            onUpdateExpense(expense.id, {
                              costAmount: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Komentar
                      </label>
                      <input
                        type="text"
                        value={expense.comment}
                        onChange={(e) =>
                          onUpdateExpense(expense.id, {
                            comment: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Interna napomena..."
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Otpremi fajl (faktura/račun)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file)
                            onUpdateExpense(expense.id, { uploadedFile: file });
                        }}
                        className="hidden"
                        id={`file-${expense.id}`}
                      />
                      <label
                        htmlFor={`file-${expense.id}`}
                        className="flex items-center px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {expense.uploadedFile
                            ? expense.uploadedFile.name
                            : "Izaberi fajl"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={onAddCustomExpense}
              className="flex items-center px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
            >
              <span className="mr-2">＋</span>
              Dodaj drugi trošak
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Otkaži
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Sačuvaj rashode
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
