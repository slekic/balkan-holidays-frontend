import React from "react";
import {
  RotateCcw,
  Trash2,
  Calendar,
  Users,
  MapPin,
  Euro,
  AlertTriangle,
} from "lucide-react";
import { DeletedOffer } from "../types";

interface DeletedOfferCardProps {
  offer: DeletedOffer;
  onRestore: (offerId: string) => void;
  onPermanentDelete: (offerId: string) => void;
}

export const DeletedOfferCard: React.FC<DeletedOfferCardProps> = ({
  offer,
  onRestore,
  onPermanentDelete,
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
        <div className="flex flex-col items-end space-y-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              offer.status
            )}`}
          >
            {offer.status}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <Trash2 className="w-3 h-3 mr-1" />
            Obrisano
          </span>
        </div>
      </div>

      {/* Deletion Info */}
      <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center">
          <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
          <span className="text-sm font-medium text-red-800">
            Obrisano {new Date(offer.deletedAt).toLocaleDateString()} od strane {offer.deletedBy}
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

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={() => onRestore(offer.id)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Vrati ponudu
        </button>
        <button
          onClick={() => onPermanentDelete(offer.id)}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Trajno obriši
        </button>
      </div>
    </div>
  );
};
