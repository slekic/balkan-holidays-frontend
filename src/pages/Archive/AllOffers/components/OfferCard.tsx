import React from "react";
import {
  Eye,
  Edit,
  Copy,
  Trash2,
  FileText,
  Receipt,
  CreditCard,
  Calendar,
  Users,
  MapPin,
  Euro,
  ChevronDown,
} from "lucide-react";
import { Offer } from "../types";

interface OfferCardProps {
  offer: Offer;
  onStatusChange: (offerId: string, newStatus: string) => void;
  onAction: (action: string, offerId: string) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onStatusChange,
  onAction,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent":
        return "bg-blue-100 text-blue-800";
      case "Accepted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Finished":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {offer.name}
          </h3>
          <p className="text-sm text-gray-500">{offer.code}</p>
        </div>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            offer.status
          )}`}
        >
          {offer.status}
        </span>
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
            {new Date(offer.startDate).toLocaleDateString()} -{" "}
            {new Date(offer.endDate).toLocaleDateString()}
          </span>
          <span className="mx-2">•</span>
          <span>{offer.days} dana</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Euro className="w-4 h-4 mr-2" />
          <span className="font-semibold text-lg text-gray-900">
            €{offer.totalPrice.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-2" />
          <span>
            Kreirao {new Date(offer.createdAt).toLocaleDateString()}{" "}
            {offer.createdBy}
          </span>
        </div>
      </div>

      {/* Status Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <div className="relative">
          <select
            value={offer.status}
            onChange={(e) => onStatusChange(offer.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="Sent">Poslato</option>
            <option value="Accepted">Prihvaćeno</option>
            <option value="Rejected">Odbijeno</option>
            <option value="Finished">Završeno</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Invoice Actions for Accepted Offers */}
      {offer.status === "Accepted" && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm font-medium text-green-800 mb-2">
            Akcije fakture
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onAction("proforma", offer.id)}
              className="flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
            >
              <FileText className="w-3 h-3 mr-1" />
              Predračun
            </button>
            <button
              onClick={() => onAction("advance", offer.id)}
              className="flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
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
      )}

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
        <button
          onClick={() => onAction("delete", offer.id)}
          className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Obriši
        </button>
      </div>
    </div>
  );
};
