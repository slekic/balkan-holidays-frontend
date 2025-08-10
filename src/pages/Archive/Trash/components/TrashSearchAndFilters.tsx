import React from "react";
import { Search, Filter } from "lucide-react";
import { TrashFilters } from "../types";

interface TrashSearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  filters: TrashFilters;
  onFilterChange: (filters: Partial<TrashFilters>) => void;
}

export const TrashSearchAndFilters: React.FC<TrashSearchAndFiltersProps> = ({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  filters,
  onFilterChange,
}) => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Klijent
              </label>
              <select
                value={filters.client}
                onChange={(e) =>
                  onFilterChange({ client: e.target.value })
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
                  onFilterChange({ status: e.target.value })
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
                  onFilterChange({ createdBy: e.target.value })
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
                  onFilterChange({ deletedBy: e.target.value })
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
  );
};

