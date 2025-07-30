import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  FileText,
  Building2,
  UtensilsCrossed,
  Car,
  UserCheck,
  MapPin,
  Gift,
  Eye,
  ChevronLeft,
  ChevronRight,
  Paperclip,
} from "lucide-react";

interface Expense {
  id: string;
  offerCode: string;
  offerName: string;
  client: string;
  entityType:
    | "hotel"
    | "restaurant"
    | "transport"
    | "guide"
    | "activity"
    | "gift"
    | "other";
  entityName: string;
  amount: number;
  comment: string;
  attachedFile?: string;
  createdBy: string;
  createdAt: string;
  travelDate: string;
}

const mockExpenses: Expense[] = [
  {
    id: "1",
    offerCode: "BCT-2024-001",
    offerName: "Belgrade Cultural Tour",
    client: "ABC Travel Agency",
    entityType: "hotel",
    entityName: "Hotel Metropol Palace",
    amount: 2500,
    comment: "Room booking commission and service fees",
    attachedFile: "hotel-invoice-001.pdf",
    createdBy: "Finance Manager",
    createdAt: "2024-01-20",
    travelDate: "2024-03-15",
  },
  {
    id: "2",
    offerCode: "BCT-2024-001",
    offerName: "Belgrade Cultural Tour",
    client: "ABC Travel Agency",
    entityType: "restaurant",
    entityName: "Tri šešira",
    amount: 450,
    comment: "Group dinner arrangement fee",
    attachedFile: "restaurant-receipt-002.pdf",
    createdBy: "Finance Manager",
    createdAt: "2024-01-22",
    travelDate: "2024-03-16",
  },
  {
    id: "3",
    offerCode: "SHJ-2024-003",
    offerName: "Serbian Heritage Journey",
    client: "Global Adventures Inc.",
    entityType: "transport",
    entityName: "Airport Transfer - Mercedes E-Class",
    amount: 180,
    comment: "Premium transfer service",
    createdBy: "Operations Manager",
    createdAt: "2024-01-25",
    travelDate: "2024-05-05",
  },
  {
    id: "4",
    offerCode: "MAP-2024-005",
    offerName: "Mountain Adventure Package",
    client: "Adventure Seekers Ltd.",
    entityType: "guide",
    entityName: "Mountain Guide - Petar Jovanović",
    amount: 320,
    comment: "Professional mountain guide services",
    attachedFile: "guide-contract-004.pdf",
    createdBy: "Admin User",
    createdAt: "2024-02-10",
    travelDate: "2024-07-15",
  },
  {
    id: "5",
    offerCode: "WTT-2024-006",
    offerName: "Wine Tasting Tour",
    client: "Gourmet Travels Inc.",
    entityType: "activity",
    entityName: "Winery Tour - Oplenac",
    amount: 280,
    comment: "Private winery tour and tasting",
    createdBy: "Operations Manager",
    createdAt: "2024-02-05",
    travelDate: "2024-08-05",
  },
  {
    id: "6",
    offerCode: "BCT-2024-001",
    offerName: "Belgrade Cultural Tour",
    client: "ABC Travel Agency",
    entityType: "gift",
    entityName: "Welcome Gift Package",
    amount: 125,
    comment: "Custom welcome gifts for group",
    attachedFile: "gift-invoice-006.pdf",
    createdBy: "Finance Manager",
    createdAt: "2024-01-18",
    travelDate: "2024-03-15",
  },
  {
    id: "7",
    offerCode: "SHJ-2024-003",
    offerName: "Serbian Heritage Journey",
    client: "Global Adventures Inc.",
    entityType: "other",
    entityName: "Photography Services",
    amount: 400,
    comment: "Professional photographer for group photos",
    attachedFile: "photography-contract-007.pdf",
    createdBy: "Operations Manager",
    createdAt: "2024-01-28",
    travelDate: "2024-05-07",
  },
];

const entityIcons = {
  hotel: Building2,
  restaurant: UtensilsCrossed,
  transport: Car,
  guide: UserCheck,
  activity: MapPin,
  gift: Gift,
  other: FileText,
};

const entityColors = {
  hotel: "bg-blue-100 text-blue-800",
  restaurant: "bg-green-100 text-green-800",
  transport: "bg-purple-100 text-purple-800",
  guide: "bg-orange-100 text-orange-800",
  activity: "bg-red-100 text-red-800",
  gift: "bg-pink-100 text-pink-800",
  other: "bg-gray-100 text-gray-800",
};

export default function Expenses() {
  const [expenses] = useState<Expense[]>(mockExpenses);
  const [filteredExpenses, setFilteredExpenses] =
    useState<Expense[]>(mockExpenses);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    entityType: "",
    entityName: "",
    client: "",
    createdBy: "",
    dateFrom: "",
    dateTo: "",
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExpenses = filteredExpenses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const handleViewFile = (fileName: string) => {
    console.log(`Viewing file: ${fileName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Troškovi</h1>
          <p className="text-gray-600 mt-1">
            Pratite interne troškove povezane sa ponudama i entitetima
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Download className="w-4 h-4 mr-2" />
          Izvezi u Excel
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Ukupni troškovi</p>
            <p className="text-2xl font-bold text-gray-900">
              €{totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Broj troškova</p>
            <p className="text-2xl font-bold text-gray-900">
              {filteredExpenses.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">
              {" "}
              Prosečan trošak
            </p>
            <p className="text-2xl font-bold text-gray-900">
              €
              {filteredExpenses.length > 0
                ? Math.round(totalAmount / filteredExpenses.length)
                : 0}
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
              placeholder="Pretraži po nazivu ponude, šifri ili entitetu..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tip entiteta
                </label>
                <select
                  value={filters.entityType}
                  onChange={(e) =>
                    setFilters({ ...filters, entityType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Svi tipovi</option>
                  <option value="hotel">Hotel</option>
                  <option value="restaurant">Restoran</option>
                  <option value="transport">Prevoz</option>
                  <option value="guide">Vodič</option>
                  <option value="activity">Aktivnost</option>
                  <option value="gift">Poklon</option>
                  <option value="other">Ostalo</option>
                </select>
              </div>

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
                  <option value="Finance Manager">Finance Manager</option>
                  <option value="Operations Manager">Operations Manager</option>
                  <option value="Admin User">Admin User</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Naziv entiteta
                </label>
                <input
                  type="text"
                  placeholder="	Pretraži naziv entiteta..."
                  value={filters.entityName}
                  onChange={(e) =>
                    setFilters({ ...filters, entityName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Datum putovanja od
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    setFilters({ ...filters, dateFrom: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Datum putovanja do
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) =>
                    setFilters({ ...filters, dateTo: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expenses Table */}
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
              {currentExpenses.map((expense) => {
                const EntityIcon = entityIcons[expense.entityType];
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
                            entityColors[expense.entityType]
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
                          onClick={() => handleViewFile(expense.attachedFile!)}
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

      {/* Empty State */}
      {filteredExpenses.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nema pronađenih troškova
          </h3>
          <p className="text-gray-600">
            Pokušajte promeniti kriterijume pretrage ili filtera.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Prikazano {startIndex + 1} do{" "}
            {Math.min(startIndex + itemsPerPage, filteredExpenses.length)} od{" "}
            {filteredExpenses.length} troškova
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
