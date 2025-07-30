import React, { useState } from "react";
import {
  Search,
  Filter,
  RotateCcw,
  Trash2,
  Download,
  Calendar,
  Users,
  MapPin,
  Euro,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

interface DeletedOffer {
  id: string;
  name: string;
  code: string;
  client: string;
  numberOfPersons: number;
  startDate: string;
  endDate: string;
  days: number;
  totalPrice: number;
  status: "Sent" | "Accepted" | "Rejected" | "Finished";
  createdAt: string;
  createdBy: string;
  deletedAt: string;
  deletedBy: string;
}

const mockDeletedOffers: DeletedOffer[] = [
  {
    id: "7",
    name: "Cancelled Corporate Retreat",
    code: "CCR-2024-007",
    client: "Tech Solutions Inc.",
    numberOfPersons: 40,
    startDate: "2024-09-15",
    endDate: "2024-09-18",
    days: 4,
    totalPrice: 22000,
    status: "Sent",
    createdAt: "2024-01-28",
    createdBy: "Operations Manager",
    deletedAt: "2024-02-01",
    deletedBy: "Admin User",
  },
  {
    id: "8",
    name: "Outdated Summer Package",
    code: "OSP-2024-008",
    client: "Family Vacations Ltd.",
    numberOfPersons: 8,
    startDate: "2024-06-20",
    endDate: "2024-06-25",
    days: 6,
    totalPrice: 6400,
    status: "Rejected",
    createdAt: "2024-01-15",
    createdBy: "Admin User",
    deletedAt: "2024-01-30",
    deletedBy: "Operations Manager",
  },
  {
    id: "9",
    name: "Duplicate Festival Tour",
    code: "DFT-2024-009",
    client: "Music Lovers Group",
    numberOfPersons: 18,
    startDate: "2024-08-10",
    endDate: "2024-08-14",
    days: 5,
    totalPrice: 11700,
    status: "Sent",
    createdAt: "2024-01-22",
    createdBy: "Operations Manager",
    deletedAt: "2024-01-29",
    deletedBy: "Admin User",
  },
];

export default function Trash() {
  const [offers] = useState<DeletedOffer[]>(mockDeletedOffers);
  const [filteredOffers, setFilteredOffers] =
    useState<DeletedOffer[]>(mockDeletedOffers);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    client: "",
    createdBy: "",
    deletedBy: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOffers = filteredOffers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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

  const handleRestore = (offerId: string) => {
    if (
      confirm(
        "Are you sure you want to restore this offer? It will be moved back to All Offers."
      )
    ) {
      console.log(`Restoring offer ${offerId}`);
    }
  };

  const handlePermanentDelete = (offerId: string) => {
    if (
      confirm(
        "Are you sure you want to permanently delete this offer? This action cannot be undone."
      )
    ) {
      console.log(`Permanently deleting offer ${offerId}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Obrisane ponude</h1>
          <p className="text-gray-600 mt-1">
            Upravljaj obrisanim ponudama – vrati ili trajno obriši
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Download className="w-4 h-4 mr-2" />
          Izvezi u Excel
        </button>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">
              Obrisane ponude
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              Ove ponude su privremeno obrisane. Možete ih vratiti u sve ponude
              ili ih trajno obrisati. Trajno brisanje je nepovratno.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pretraži po nazivu ponude ili šifri..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
              showFilters
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filteri
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Klijent
                </label>
                <select
                  value={filters.client}
                  onChange={(e) =>
                    setFilters({ ...filters, client: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Svi klijenti</option>
                  <option value="Tech Solutions Inc.">
                    Tech Solutions Inc.
                  </option>
                  <option value="Family Vacations Ltd.">
                    Family Vacations Ltd.
                  </option>
                  <option value="Music Lovers Group">Music Lovers Group</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Svi statusi</option>
                  <option value="Sent">Poslato</option>
                  <option value="Accepted">Prihvaćeno</option>
                  <option value="Rejected">Odbijeno</option>
                  <option value="Finished">Završeno</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kreirao
                </label>
                <select
                  value={filters.createdBy}
                  onChange={(e) =>
                    setFilters({ ...filters, createdBy: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Svi korisnici</option>
                  <option value="Admin User">Admin User</option>
                  <option value="Operations Manager">Operations Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Obrisao
                </label>
                <select
                  value={filters.deletedBy}
                  onChange={(e) =>
                    setFilters({ ...filters, deletedBy: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Svi korisnici</option>
                  <option value="Admin User">Admin User</option>
                  <option value="Operations Manager">Operations Manager</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 opacity-75"
          >
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
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">
                Obrisano - {new Date(offer.deletedAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-red-600 mt-1">
                Obrisao/la: {offer.deletedBy}
              </p>
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
                onClick={() => handleRestore(offer.id)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Vrati ponudu
              </button>
              <button
                onClick={() => handlePermanentDelete(offer.id)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Trajno obriši
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredOffers.length === 0 && (
        <div className="text-center py-12">
          <Trash2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Trash is empty
          </h3>
          <p className="text-gray-600">No deleted offers found.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredOffers.length)} of{" "}
            {filteredOffers.length} offers
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
