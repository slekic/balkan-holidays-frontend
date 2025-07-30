import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Trash2,
  Download,
  FileText,
  Receipt,
  CreditCard,
  Calendar,
  Users,
  MapPin,
  Euro,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";

interface Offer {
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
  entities: string[];
  lastUpdated: string;
  daysSinceUpdate: number;
}

const mockFollowUpOffers: Offer[] = [
  {
    id: "2",
    name: "Danube River Experience",
    code: "DRE-2024-002",
    client: "European Tours Ltd.",
    numberOfPersons: 15,
    startDate: "2024-04-10",
    endDate: "2024-04-13",
    days: 4,
    totalPrice: 8750,
    status: "Sent",
    createdAt: "2024-01-20",
    createdBy: "Admin User",
    entities: [
      "Hyatt Regency Belgrade",
      "Danube River Cruise",
      "Lorenzo & Kakalamba",
    ],
    lastUpdated: "2024-01-20",
    daysSinceUpdate: 10,
  },
  {
    id: "5",
    name: "Mountain Adventure Package",
    code: "MAP-2024-005",
    client: "Adventure Seekers Ltd.",
    numberOfPersons: 20,
    startDate: "2024-07-15",
    endDate: "2024-07-20",
    days: 6,
    totalPrice: 15600,
    status: "Sent",
    createdAt: "2024-01-10",
    createdBy: "Operations Manager",
    entities: ["Mountain Lodge", "Hiking Guide", "Traditional Restaurant"],
    lastUpdated: "2024-01-12",
    daysSinceUpdate: 8,
  },
  {
    id: "6",
    name: "Wine Tasting Tour",
    code: "WTT-2024-006",
    client: "Gourmet Travels Inc.",
    numberOfPersons: 12,
    startDate: "2024-08-05",
    endDate: "2024-08-08",
    days: 4,
    totalPrice: 9800,
    status: "Sent",
    createdAt: "2024-01-05",
    createdBy: "Admin User",
    entities: ["Boutique Hotel", "Winery Tours", "Fine Dining Restaurant"],
    lastUpdated: "2024-01-07",
    daysSinceUpdate: 12,
  },
];

export default function FollowUpOffers() {
  const [offers] = useState<Offer[]>(mockFollowUpOffers);
  const [filteredOffers, setFilteredOffers] =
    useState<Offer[]>(mockFollowUpOffers);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    client: "",
    entity: "",
    createdBy: "",
    status: "",
    personsMin: "",
    personsMax: "",
    priceMin: "",
    priceMax: "",
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

  const getFollowUpUrgency = (days: number) => {
    if (days >= 14) return "bg-red-100 text-red-800";
    if (days >= 10) return "bg-orange-100 text-orange-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const handleStatusChange = (offerId: string, newStatus: string) => {
    console.log(`Changing offer ${offerId} status to ${newStatus}`);
  };

  const handleAction = (action: string, offerId: string) => {
    console.log(`${action} action for offer ${offerId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Follow-up ponude</h1>
          <p className="text-gray-600 mt-1">
            Ponude koje zahtevaju praćenje (poslate, ali nisu ažurirane 7 dana)
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Download className="w-4 h-4 mr-2" />
          Izvezi u Excel
        </button>
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
                  <option value="European Tours Ltd.">
                    European Tours Ltd.
                  </option>
                  <option value="Adventure Seekers Ltd.">
                    Adventure Seekers Ltd.
                  </option>
                  <option value="Gourmet Travels Inc.">
                    Gourmet Travels Inc.
                  </option>
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
                  Entitet u ponudi
                </label>
                <input
                  type="text"
                  placeholder="Hotel, restoran..."
                  value={filters.entity}
                  onChange={(e) =>
                    setFilters({ ...filters, entity: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opseg osoba
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.personsMin}
                    onChange={(e) =>
                      setFilters({ ...filters, personsMin: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Maks"
                    value={filters.personsMax}
                    onChange={(e) =>
                      setFilters({ ...filters, personsMax: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
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
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            {/* Header with Follow-up Badge */}
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
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getFollowUpUrgency(
                    offer.daysSinceUpdate
                  )}`}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Follow-up
                </span>
              </div>
            </div>

            {/* Follow-up Alert */}
            <div
              className={`mb-4 p-3 rounded-lg ${
                offer.daysSinceUpdate >= 14
                  ? "bg-red-50 border border-red-200"
                  : offer.daysSinceUpdate >= 10
                  ? "bg-orange-50 border border-orange-200"
                  : "bg-yellow-50 border border-yellow-200"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  offer.daysSinceUpdate >= 14
                    ? "text-red-800"
                    : offer.daysSinceUpdate >= 10
                    ? "text-orange-800"
                    : "text-yellow-800"
                }`}
              >
                <Clock className="w-4 h-4 inline mr-1" />
                Nije izmenjen status {offer.daysSinceUpdate} dana
              </p>
              <p
                className={`text-xs mt-1 ${
                  offer.daysSinceUpdate >= 14
                    ? "text-red-600"
                    : offer.daysSinceUpdate >= 10
                    ? "text-orange-600"
                    : "text-yellow-600"
                }`}
              >
                Poslednje ažuriranje:{" "}
                {new Date(offer.lastUpdated).toLocaleDateString()}
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

            {/* Status Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="relative">
                <select
                  value={offer.status}
                  onChange={(e) => handleStatusChange(offer.id, e.target.value)}
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

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAction("view", offer.id)}
                  className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Pregledaj
                </button>
                <button
                  onClick={() => handleAction("edit", offer.id)}
                  className="flex items-center px-3 py-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Izmeni
                </button>
                <button
                  onClick={() => handleAction("duplicate", offer.id)}
                  className="flex items-center px-3 py-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Dupliraj
                </button>
              </div>
              <button
                onClick={() => handleAction("delete", offer.id)}
                className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Obriši
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredOffers.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No follow-up offers
          </h3>
          <p className="text-gray-600">
            All sent offers have been recently updated.
          </p>
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
