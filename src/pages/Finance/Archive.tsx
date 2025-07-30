import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Download,
  FileText,
  Receipt,
  CreditCard,
  Calendar,
  Users,
  Euro,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface FinanceOffer {
  id: string;
  name: string;
  code: string;
  client: string;
  numberOfPersons: number;
  startDate: string;
  endDate: string;
  days: number;
  totalPrice: number;
  status: "Accepted" | "Finished";
  createdAt: string;
  createdBy: string;
  totalPaid: number;
  paymentStatus: "Not Paid" | "Partially Paid" | "Fully Paid";
}

const mockFinanceOffers: FinanceOffer[] = [
  {
    id: "1",
    name: "Belgrade Cultural Tour",
    code: "BCT-2024-001",
    client: "ABC Travel Agency",
    numberOfPersons: 25,
    startDate: "2024-03-15",
    endDate: "2024-03-18",
    days: 4,
    totalPrice: 12500,
    status: "Accepted",
    createdAt: "2024-01-15",
    createdBy: "Operations Manager",
    totalPaid: 5000,
    paymentStatus: "Partially Paid",
  },
  {
    id: "3",
    name: "Serbian Heritage Journey",
    code: "SHJ-2024-003",
    client: "Global Adventures Inc.",
    numberOfPersons: 30,
    startDate: "2024-05-05",
    endDate: "2024-05-10",
    days: 6,
    totalPrice: 18900,
    status: "Finished",
    createdAt: "2024-01-25",
    createdBy: "Operations Manager",
    totalPaid: 18900,
    paymentStatus: "Fully Paid",
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
    status: "Accepted",
    createdAt: "2024-02-10",
    createdBy: "Admin User",
    totalPaid: 0,
    paymentStatus: "Not Paid",
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
    status: "Finished",
    createdAt: "2024-02-05",
    createdBy: "Operations Manager",
    totalPaid: 9800,
    paymentStatus: "Fully Paid",
  },
];

export default function FinanceArchive() {
  const [offers] = useState<FinanceOffer[]>(mockFinanceOffers);
  const [filteredOffers, setFilteredOffers] =
    useState<FinanceOffer[]>(mockFinanceOffers);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    client: "",
    createdBy: "",
    status: "",
    paymentStatus: "",
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
      case "Accepted":
        return "bg-green-100 text-green-800";
      case "Finished":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Not Paid":
        return "bg-red-100 text-red-800";
      case "Partially Paid":
        return "bg-yellow-100 text-yellow-800";
      case "Fully Paid":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAction = (action: string, offerId: string) => {
    console.log(`${action} action for offer ${offerId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Finansijska Arhiva
          </h1>
          <p className="text-gray-600 mt-1">
            Upravljaj prihvaćenim i završenim ponudama za finansijsku obradu
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
              placeholder="Pretraga po nazivu ili šifri ponude..."
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
                  <option value="ABC Travel Agency">ABC Travel Agency</option>
                  <option value="Global Adventures Inc.">
                    Global Adventures Inc.
                  </option>
                  <option value="Adventure Seekers Ltd.">
                    Adventure Seekers Ltd.
                  </option>
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
                  <option value="Accepted">Prihvaćena</option>
                  <option value="Finished">Završena</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status Uplate
                </label>
                <select
                  value={filters.paymentStatus}
                  onChange={(e) =>
                    setFilters({ ...filters, paymentStatus: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Svi statusi uplate</option>
                  <option value="Not Paid">Nije Plaćeno</option>
                  <option value="Partially Paid">Delimično Plaćeno</option>
                  <option value="Fully Paid">Uplaćeno</option>
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
                  <option value="Admin User">Admin</option>
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
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
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
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                    offer.paymentStatus
                  )}`}
                >
                  {offer.paymentStatus}
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

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Euro className="w-4 h-4 mr-2" />
                  <span className="font-semibold text-lg text-gray-900">
                    €{offer.totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Uplaćeno: €{offer.totalPaid.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Preostalo: €
                    {(offer.totalPrice - offer.totalPaid).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progres uplate</span>
                <span className="font-medium">
                  {Math.round((offer.totalPaid / offer.totalPrice) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(offer.totalPaid / offer.totalPrice) * 100}%`,
                  }}
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
                  onClick={() => handleAction("proforma", offer.id)}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Predračun
                </button>
                <button
                  onClick={() => handleAction("advance", offer.id)}
                  className="flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                >
                  <Receipt className="w-3 h-3 mr-1" />
                  Avansna faktura
                </button>
                <button
                  onClick={() => handleAction("final", offer.id)}
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
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredOffers.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nema pronađenih ponuda
          </h3>
          <p className="text-gray-600">
            Pokušaj da izmeniš pretragu ili filtere.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Prikazano {startIndex + 1} do{" "}
            {Math.min(startIndex + itemsPerPage, filteredOffers.length)} od
            ukupno {filteredOffers.length} ponuda
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prethodna
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
              Sledeća
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
