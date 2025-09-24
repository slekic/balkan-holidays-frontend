import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { FinanceFilters } from "../utils/types";
import { filterOptions } from "../utils/constants";
import { useCMS } from "../../../../contexts/CMSContext";
import { useUsers } from "../../../UserManagement/UserContext";

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  filters: FinanceFilters;
  onFilterChange: (key: keyof FinanceFilters, value: string) => void;
  onClearFilters: () => void;
}

export default function SearchAndFilters({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  filters,
  onFilterChange,
  onClearFilters,
}: SearchAndFiltersProps) {
  const { clients } = useCMS(); 
  const { users } = useUsers();

  const [clientDropdownVisible, setClientDropdownVisible] = useState(false);
  const [creatorDropdownVisible, setCreatorDropdownVisible] = useState(false);

  const handleClientSelect = (name: string) => {
    onFilterChange("client", name);
    setClientDropdownVisible(false);
  };

  const handleCreatorSelect = (name: string) => {
    onFilterChange("createdBy", name);
    setCreatorDropdownVisible(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Search i toggle button */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Pretraga po nazivu ili šifri ponude..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={onToggleFilters}
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Napredni filteri</h3>
            <button
              onClick={onClearFilters}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Očisti filtere
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Klijent */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Klijent
              </label>
              <input
                type="text"
                placeholder="Pretraži klijenta..."
                value={filters.client || ""}
                onChange={(e) => {
                  onFilterChange("client", e.target.value);
                  setClientDropdownVisible(true);
                }}
                onFocus={() => setClientDropdownVisible(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {clientDropdownVisible && filters.client && (
                <ul className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
                  {clients
                    .filter((c) =>
                      c.name.toLowerCase().includes(filters.client!.toLowerCase())
                    )
                    .map((c) => (
                      <li
                        key={c.id}
                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleClientSelect(c.name)}
                      >
                        {c.name}
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => onFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Svi statusi</option>
                {filterOptions.statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "Accepted" ? "Prihvaćena" : "Završena"}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Uplate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Uplate
              </label>
              <select
                value={filters.paymentStatus}
                onChange={(e) => onFilterChange("paymentStatus", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Svi statusi uplate</option>
                {filterOptions.paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "Not Paid"
                      ? "Nije Plaćeno"
                      : status === "Partially Paid"
                      ? "Delimično Plaćeno"
                      : "Uplaćeno"}
                  </option>
                ))}
              </select>
            </div>

            {/* Kreirao */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kreirao
              </label>
              <input
                type="text"
                placeholder="Pretraži korisnika..."
                value={filters.createdBy || ""}
                onChange={(e) => {
                  onFilterChange("createdBy", e.target.value);
                  setCreatorDropdownVisible(true);
                }}
                onFocus={() => setCreatorDropdownVisible(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {creatorDropdownVisible && filters.createdBy && (
                <ul className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
                  {users
                    .filter((u) =>
                      u.name.toLowerCase().includes(filters.createdBy!.toLowerCase())
                    )
                    .map((u) => (
                      <li
                        key={u.id}
                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleCreatorSelect(u.name)}
                      >
                        {u.name}
                      </li>
                    ))}
                </ul>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
