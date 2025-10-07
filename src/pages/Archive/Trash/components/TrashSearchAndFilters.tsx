import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import type { TrashFilters } from "../types";
import { useClients } from "../../../../contexts";
import { useUsers } from "../../../UserManagement/UserContext";

interface TrashSearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  filters: TrashFilters;
  onFilterChange: (filters: Partial<TrashFilters>) => void;
  onSearch: (filters: Partial<TrashFilters>, value: string) => void;
  onReset: () => void;  
}

export const TrashSearchAndFilters: React.FC<TrashSearchAndFiltersProps> = ({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  filters,
  onFilterChange,
  onSearch,
  onReset, 
}) => {
  const { clients } = useClients();
  const { users } = useUsers();

  const [clientDropdownVisible, setClientDropdownVisible] = useState(false);
  const [creatorDropdownVisible, setCreatorDropdownVisible] = useState(false);
  const [deleterDropdownVisible, setDeleterDropdownVisible] = useState(false);

  const handleClientSelect = (name: string) => {
    onFilterChange({ client: name });
    setClientDropdownVisible(false);
  };

  const handleCreatorSelect = (name: string) => {
    onFilterChange({ createdBy: name });
    setCreatorDropdownVisible(false);
  };

  const handleDeleterSelect = (name: string) => {
    onFilterChange({ deletedBy: name });
    setDeleterDropdownVisible(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Pretraži po nazivu ponude ili šifri..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* Filteri dugme */}
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
        onClick={() => onSearch(filters, searchTerm)}
        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        <Search className="w-4 h-4 mr-2" />
        Pretraži
      </button>
      <button
        onClick={onReset}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        <X className="w-4 h-4 mr-2" />
        Resetuj
      </button>
      </div>

      {showFilters && (
        <div className="border-t border-gray-200 pt-4">
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
                  onFilterChange({ client: e.target.value });
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
                onChange={(e) => onFilterChange({ status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Svi statusi</option>
                <option value="Sent">Poslato</option>
                <option value="Accepted">Prihvaćeno</option>
                <option value="Rejected">Odbijeno</option>
                <option value="Finished">Završeno</option>
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
                  onFilterChange({ createdBy: e.target.value });
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

            {/* Obrisao */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Obrisao
              </label>
              <input
                type="text"
                placeholder="Pretraži korisnika..."
                value={filters.deletedBy || ""}
                onChange={(e) => {
                  onFilterChange({ deletedBy: e.target.value });
                  setDeleterDropdownVisible(true);
                }}
                onFocus={() => setDeleterDropdownVisible(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {deleterDropdownVisible && filters.deletedBy && (
                <ul className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
                  {users
                    .filter((u) =>
                      u.name.toLowerCase().includes(filters.deletedBy!.toLowerCase())
                    )
                    .map((u) => (
                      <li
                        key={u.id}
                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleDeleterSelect(u.name)}
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
};
