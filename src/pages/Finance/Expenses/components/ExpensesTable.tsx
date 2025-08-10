import React from "react";
import { Paperclip } from "lucide-react";
import { Expense } from "../utils/types";
import { ENTITY_ICONS, ENTITY_COLORS } from "../utils/constants";

interface ExpensesTableProps {
  expenses: Expense[];
  onViewFile: (fileName: string) => void;
}

export const ExpensesTable: React.FC<ExpensesTableProps> = ({
  expenses,
  onViewFile,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Ponuda
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Entitet
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Iznos
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Komentar
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Dokument
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Kreirano
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => {
              const EntityIcon = ENTITY_ICONS[expense.entityType];
              return (
                <tr
                  key={expense.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {expense.offerCode}
                      </p>
                      <p className="text-sm text-gray-600">
                        {expense.client}
                      </p>
                      <p className="text-xs text-gray-500">
                        Travel:{" "}
                        {new Date(expense.travelDate).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                          ENTITY_COLORS[expense.entityType]
                        }`}
                      >
                        <EntityIcon className="w-3 h-3 mr-1" />
                        {expense.entityType}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {expense.entityName}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-900">
                      €{expense.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-700 max-w-xs truncate">
                      {expense.comment || "-"}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    {expense.attachedFile ? (
                      <button
                        onClick={() => onViewFile(expense.attachedFile!)}
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Paperclip className="w-4 h-4 mr-1" />
                        Pogledaj fajl
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Nema fajla
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <p className="text-gray-900">
                        {new Date(expense.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">{expense.createdBy}</p>
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
};
