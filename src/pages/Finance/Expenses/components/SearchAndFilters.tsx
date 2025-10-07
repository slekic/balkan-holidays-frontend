import React, { useEffect, useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { ExpenseFilters } from "../utils/types";
import { ENTITY_TYPE_LABELS } from "../utils/constants";
import { useCMS } from "../../../../contexts/CMSContext";
import { useUsers } from "../../../UserManagement/UserContext";

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  filters: ExpenseFilters;
  onFilterChange: (filters: ExpenseFilters) => void;
  onSearch: (filters: ExpenseFilters, value: string) => void;
  onReset: () => void;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  filters,
  onFilterChange,
  onSearch,
  onReset,
}) => {
  const { clients } = useCMS();
  const { users } = useUsers();

  const [localSearch, setLocalSearch] = useState(searchTerm);
  
  const [clientDropdownVisible, setClientDropdownVisible] = useState(false);
  const [creatorDropdownVisible, setCreatorDropdownVisible] = useState(false);

  useEffect(() => {
        const timeout = setTimeout(() => {
          onSearchChange(localSearch);
        }, 300);
        return () => clearTimeout(timeout);
      }, [localSearch, onSearchChange]);
    
      useEffect(() => {
        setLocalSearch(searchTerm);
      }, [searchTerm]);
      
  const handleFilterChange = (key: keyof ExpenseFilters, value: string) => {
      onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Pretraži po nazivu ponude, šifri ili entitetu..."
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
        <button
            onClick={() => onSearch(filters, localSearch)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Search className="w-4 h-4 mr-2" />
            Pretraži
          </button>
          <button
            onClick={onReset}
            className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Resetuj
          </button>
      </div>

      {showFilters && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Tip entiteta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tip entiteta
              </label>
              <select
                value={filters.entityType}
                onChange={(e) => handleFilterChange("entityType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Svi tipovi</option>
                {Object.entries(ENTITY_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

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
                  handleFilterChange("client", e.target.value);
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
                        onClick={() => handleFilterChange("client", c.name)}
                      >
                        {c.name}
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* Naziv entiteta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naziv entiteta
              </label>
              <input
                type="text"
                placeholder="Pretraži naziv entiteta..."
                value={filters.entityName}
                onChange={(e) => handleFilterChange("entityName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
