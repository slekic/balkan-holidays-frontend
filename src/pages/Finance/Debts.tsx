import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  AlertTriangle,
  Calendar,
  Users,
  Euro,
  ChevronLeft,
  ChevronRight,
  Clock,
  TrendingUp,
} from "lucide-react";

interface DebtOffer {
  id: string;
  name: string;
  code: string;
  client: string;
  numberOfPersons: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  totalPaid: number;
  remainingAmount: number;
  paymentPercentage: number;
  status: "Accepted" | "Finished";
  createdAt: string;
  daysSinceCreated: number;
  urgencyLevel: "Low" | "Medium" | "High" | "Critical";
  lastPaymentDate?: string;
}

const mockDebtOffers: DebtOffer[] = [
  {
    id: "1",
    name: "Belgrade Cultural Tour",
    code: "BCT-2024-001",
    client: "ABC Travel Agency",
    numberOfPersons: 25,
    startDate: "2024-03-15",
    endDate: "2024-03-18",
    totalPrice: 12500,
    totalPaid: 5000,
    remainingAmount: 7500,
    paymentPercentage: 40,
    status: "Accepted",
    createdAt: "2024-01-15",
    daysSinceCreated: 45,
    urgencyLevel: "High",
    lastPaymentDate: "2024-01-20",
  },
  {
    id: "5",
    name: "Mountain Adventure Package",
    code: "MAP-2024-005",
    client: "Adventure Seekers Ltd.",
    numberOfPersons: 20,
    startDate: "2024-07-15",
    endDate: "2024-07-20",
    totalPrice: 15600,
    totalPaid: 0,
    remainingAmount: 15600,
    paymentPercentage: 0,
    status: "Accepted",
    createdAt: "2024-02-10",
    daysSinceCreated: 20,
    urgencyLevel: "Critical",
    lastPaymentDate: undefined,
  },
  {
    id: "7",
    name: "Corporate Retreat Package",
    code: "CRP-2024-007",
    client: "Tech Solutions Inc.",
    numberOfPersons: 35,
    startDate: "2024-06-01",
    endDate: "2024-06-05",
    totalPrice: 22000,
    totalPaid: 11000,
    remainingAmount: 11000,
    paymentPercentage: 50,
    status: "Accepted",
    createdAt: "2024-01-28",
    daysSinceCreated: 32,
    urgencyLevel: "Medium",
    lastPaymentDate: "2024-02-15",
  },
  {
    id: "8",
    name: "Family Vacation Special",
    code: "FVS-2024-008",
    client: "Family Travels Ltd.",
    numberOfPersons: 8,
    startDate: "2024-09-10",
    endDate: "2024-09-15",
    totalPrice: 6800,
    totalPaid: 2040,
    remainingAmount: 4760,
    paymentPercentage: 30,
    status: "Accepted",
    createdAt: "2024-02-05",
    daysSinceCreated: 25,
    urgencyLevel: "Medium",
    lastPaymentDate: "2024-02-20",
  },
  {
    id: "9",
    name: "Educational Tour Program",
    code: "ETP-2024-009",
    client: "University Group",
    numberOfPersons: 45,
    startDate: "2024-05-20",
    endDate: "2024-05-25",
    totalPrice: 18000,
    totalPaid: 1800,
    remainingAmount: 16200,
    paymentPercentage: 10,
    status: "Accepted",
    createdAt: "2024-01-10",
    daysSinceCreated: 50,
    urgencyLevel: "Critical",
    lastPaymentDate: "2024-01-15",
  },
];

export default function Debts() {
  const [offers] = useState<DebtOffer[]>(mockDebtOffers);
  const [filteredOffers, setFilteredOffers] =
    useState<DebtOffer[]>(mockDebtOffers);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    client: "",
    urgencyLevel: "",
    status: "",
    amountMin: "",
    amountMax: "",
    dateFrom: "",
    dateTo: "",
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOffers = filteredOffers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  const totalOutstanding = filteredOffers.reduce(
    (sum, offer) => sum + offer.remainingAmount,
    0
  );
  const averageDebt =
    filteredOffers.length > 0 ? totalOutstanding / filteredOffers.length : 0;
  const criticalDebts = filteredOffers.filter(
    (offer) => offer.urgencyLevel === "Critical"
  ).length;
  const totalReceivable = filteredOffers.reduce(
    (sum, offer) => sum + offer.totalPrice,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Neizmirena dugovanja
          </h1>
          <p className="text-gray-600 mt-1">
            Prati i upravljaj neplaćenim iznosima od klijenata
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Download className="w-4 h-4 mr-2" />
          Izvezi u Excel
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Ukupno dugovanje
              </p>
              <p className="text-2xl font-bold text-red-600">
                €{totalOutstanding.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <Euro className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Kritična dugovanja
              </p>
              <p className="text-2xl font-bold text-red-600">{criticalDebts}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Prosečno dugovanje
              </p>
              <p className="text-2xl font-bold text-gray-900">
                €{Math.round(averageDebt).toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stopa naplate</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalReceivable > 0
                  ? Math.round(
                      ((totalReceivable - totalOutstanding) / totalReceivable) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner for Critical Debts */}
      {criticalDebts > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Upozorenje na kritična plaćanja
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Imate {criticalDebts} ponuda{criticalDebts !== 1 ? "s" : ""} sa
                kritičnim statusom plaćanja koje zahtevaju hitnu pažnju.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pretraži po nazivu ponude, šifri ili klijentu..."
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
                  <option value="Adventure Seekers Ltd.">
                    Adventure Seekers Ltd.
                  </option>
                  <option value="Tech Solutions Inc.">
                    Tech Solutions Inc.
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nivo hitnosti
                </label>
                <select
                  value={filters.urgencyLevel}
                  onChange={(e) =>
                    setFilters({ ...filters, urgencyLevel: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Svi nivoi</option>
                  <option value="Low">Nizak</option>
                  <option value="Medium">Srednji</option>
                  <option value="High">Visok</option>
                  <option value="Critical">Kritičan</option>
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
                  <option value="Accepted">Prihvaćeno</option>
                  <option value="Finished">Završeno</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raspon neplaćenog iznosa
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.amountMin}
                    onChange={(e) =>
                      setFilters({ ...filters, amountMin: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Maks"
                    value={filters.amountMax}
                    onChange={(e) =>
                      setFilters({ ...filters, amountMax: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Debts Table */}
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
              {currentOffers.map((offer) => (
                <tr
                  key={offer.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{offer.code}</p>
                      <p className="text-sm text-gray-600">{offer.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(offer.startDate).toLocaleDateString()} -{" "}
                        {new Date(offer.endDate).toLocaleDateString()}
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
                      €{offer.totalPrice.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <span className="font-semibold text-green-600">
                        €{offer.totalPaid.toLocaleString()}
                      </span>
                      {offer.lastPaymentDate && (
                        <p className="text-xs text-gray-500">
                          Zadnje:{" "}
                          {new Date(offer.lastPaymentDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-red-600">
                      €{offer.remainingAmount.toLocaleString()}
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
                          className={`h-2 rounded-full transition-all duration-300 ${
                            offer.paymentPercentage >= 75
                              ? "bg-green-600"
                              : offer.paymentPercentage >= 50
                              ? "bg-yellow-500"
                              : offer.paymentPercentage >= 25
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }`}
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
                        Od: {new Date(offer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredOffers.length === 0 && (
        <div className="text-center py-12">
          <Euro className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nema neizmirenih dugovanja
          </h3>
          <p className="text-gray-600">
            Sve ponude su u potpunosti plaćene ili nijedna ne odgovara zadatim
            kriterijumima.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Prikazano {startIndex + 1} do{" "}
            {Math.min(startIndex + itemsPerPage, filteredOffers.length)} od
            ukupno {filteredOffers.length} dugovanja
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
