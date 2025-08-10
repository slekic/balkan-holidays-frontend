import React from "react";
import { AlertTriangle } from "lucide-react";
import { PageHeader } from "./components/PageHeader";
import { TrashSearchAndFilters } from "./components/TrashSearchAndFilters";
import { DeletedOfferCard } from "./components/DeletedOfferCard";
import Pagination from "../shared/Pagination";
import { EmptyState } from "./components/EmptyState";
import { useTrash } from "./hooks/useTrash";

export default function Trash() {
  const {
    currentOffers,
    showFilters,
    searchTerm,
    filters,
    totalPages,
    currentPage,
    startIndex,
    itemsPerPage,
    handleRestore,
    handlePermanentDelete,
    handleExport,
    handlePageChange,
    handleSearchChange,
    handleFilterChange,
    handleToggleFilters,
  } = useTrash();

  return (
    <div className="space-y-6">
      <PageHeader onExport={handleExport} />
      
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

      <TrashSearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        showFilters={showFilters}
        onToggleFilters={handleToggleFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Offers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentOffers.map((offer) => (
          <DeletedOfferCard
            key={offer.id}
            offer={offer}
            onRestore={handleRestore}
            onPermanentDelete={handlePermanentDelete}
          />
        ))}
      </div>

      {/* Empty State */}
      {currentOffers.length === 0 && <EmptyState />}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={currentOffers.length}
        itemsPerPage={itemsPerPage}
        startIndex={startIndex}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
