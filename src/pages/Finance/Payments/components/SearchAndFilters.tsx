import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { PaymentFilters } from '../utils/types';
import { PAYMENT_STATUS_OPTIONS } from '../utils/constants';
import { useCMS } from '../../../../contexts/CMSContext';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  filters: PaymentFilters;
  onFilterChange: (key: keyof PaymentFilters, value: string) => void;
  onClearFilters: () => void;
}

export default function SearchAndFilters({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  filters,
  onFilterChange,
  onClearFilters
}: SearchAndFiltersProps) {
  const { clients } = useCMS();
  const [clientDropdownVisible, setClientDropdownVisible] = useState(false);

  const handleClientSelect = (name: string) => {
    onFilterChange('client', name);
    setClientDropdownVisible(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Pretraga po nazivu ponude, šifri ili klijentu..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={onToggleFilters}
          className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
            showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filteri
        </button>
      </div>

      {showFilters && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status uplate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status uplate</label>
              <select
                value={filters.paymentStatus}
                onChange={(e) => onFilterChange('paymentStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {PAYMENT_STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Klijent autocomplete */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Klijent</label>
              <input
                type="text"
                placeholder="Pretraži klijenta..."
                value={filters.client || ""}
                onChange={(e) => {
                  onFilterChange('client', e.target.value);
                  setClientDropdownVisible(true);
                }}
                onFocus={() => setClientDropdownVisible(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {clientDropdownVisible && filters.client && (
                <ul className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
                  {clients
                    .filter(c => c.name.toLowerCase().includes(filters.client!.toLowerCase()))
                    .map(c => (
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

            {/* Datum od */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Datum od</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Datum do */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Datum do</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => onFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={onClearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Obriši filtere
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
