import React from "react";
import {
  Eye,
  Edit,
  Copy,
  FileText,
  Receipt,
  CreditCard,
  Calendar,
  Users,
  Euro,
} from "lucide-react";
import { FinanceOffer, ActionType } from "../utils/types";
import {
  getStatusColor,
  getPaymentStatusColor,
  calculatePaymentProgress,
  formatCurrency,
  formatDate,
} from "../utils/helpers";

interface FinanceOfferCardProps {
  offer: FinanceOffer;
  onAction: (action: ActionType, offerId: string) => void;
}

export default function FinanceOfferCard({ offer, onAction }: FinanceOfferCardProps) {
  const paymentProgress = calculatePaymentProgress(offer.totalPaid, offer.totalPrice);
  const remainingAmount = offer.totalPrice - offer.totalPaid;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{offer.name}</h3>
          <p className="text-sm text-gray-500">{offer.code}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              offer.status
            )}`}
          >
            {offer.status === "Accepted" ? "Prihvaćena" : "Završena"}
          </span>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
              offer.paymentStatus
            )}`}
          >
            {offer.paymentStatus === "Not Paid" ? "Nije Plaćeno" :
             offer.paymentStatus === "Partially Paid" ? "Delimično Plaćeno" : "Uplaćeno"}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          <span className="font-medium">{offer.client}</span>
          <span className="mx-2">•</span>
          <span>{offer.numberOfPersons} osoba</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
          </span>
          <span className="mx-2">•</span>
          <span>{offer.days} dana</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <Euro className="w-4 h-4 mr-2" />
            <span className="font-semibold text-lg text-gray-900">
              {formatCurrency(offer.totalPrice)}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">
              Uplaćeno: {formatCurrency(offer.totalPaid)}
            </p>
            <p className="text-xs text-gray-500">
              Preostalo: {formatCurrency(remainingAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progres uplate</span>
          <span className="font-medium">{paymentProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${paymentProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Invoice Actions */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm font-medium text-blue-800 mb-2">
          Akcije fakture
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onAction("proforma", offer.id)}
            className="flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
          >
            <FileText className="w-3 h-3 mr-1" />
            Predračun
          </button>
          <button
            onClick={() => onAction("advance", offer.id)}
            className="flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
          >
            <Receipt className="w-3 h-3 mr-1" />
            Avansna faktura
          </button>
          <button
            onClick={() => onAction("final", offer.id)}
            className="flex items-center px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
          >
            <CreditCard className="w-3 h-3 mr-1" />
            Faktura
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => onAction("view", offer.id)}
            className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Eye className="w-4 h-4 mr-1" />
            Pregledaj
          </button>
          <button
            onClick={() => onAction("edit", offer.id)}
            className="flex items-center px-3 py-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
          >
            <Edit className="w-4 h-4 mr-1" />
            Izmeni
          </button>
          <button
            onClick={() => onAction("duplicate", offer.id)}
            className="flex items-center px-3 py-1 text-green-600 hover:bg-green-50 rounded transition-colors"
          >
            <Copy className="w-4 h-4 mr-1" />
            Dupliraj
          </button>
        </div>
      </div>
    </div>
  );
}
