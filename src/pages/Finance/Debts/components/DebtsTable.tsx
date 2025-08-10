import React from "react";
import { Users, AlertTriangle } from "lucide-react";
import { DebtOffer } from "../utils/types";
import { getUrgencyColor, getPaymentProgressColor, formatCurrency, formatDate } from "../utils/helpers";

interface DebtsTableProps {
  offers: DebtOffer[];
}

export default function DebtsTable({ offers }: DebtsTableProps) {
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
                Klijent
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Ukupan iznos
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Plaćeno
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Dugovanje
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Napredak
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Hitnost
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Dana kašnjenja
              </th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr
                key={offer.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
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
                      <p className="font-medium text-gray-900">
                        {offer.client}
                      </p>
                      <p className="text-xs text-gray-500">
                        {offer.numberOfPersons} persons
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(offer.totalPrice)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(offer.totalPaid)}
                    </span>
                    {offer.lastPaymentDate && (
                      <p className="text-xs text-gray-500">
                        Zadnje: {formatDate(offer.lastPaymentDate)}
                      </p>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-red-600">
                    {formatCurrency(offer.remainingAmount)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="w-full">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        {offer.paymentPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPaymentProgressColor(
                          offer.paymentPercentage
                        )}`}
                        style={{ width: `${offer.paymentPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(
                      offer.urgencyLevel
                    )}`}
                  >
                    {offer.urgencyLevel === "Critical" && (
                      <AlertTriangle className="w-3 h-3 mr-1" />
                    )}
                    {offer.urgencyLevel}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {offer.daysSinceCreated} days
                    </p>
                    <p className="text-xs text-gray-500">
                      Od: {formatDate(offer.createdAt)}
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

