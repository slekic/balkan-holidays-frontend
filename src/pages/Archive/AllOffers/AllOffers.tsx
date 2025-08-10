import React from "react";
import { PageHeader } from "./components/PageHeader";
import { SearchAndFilters } from "./components/SearchAndFilters";
import { OfferCard } from "./components/OfferCard";
import { Pagination } from "./components/Pagination";
import { EmptyState } from "./components/EmptyState";
import { useOffers } from "./hooks/useOffers";

export default function AllOffers() {
  const {
    currentOffers,
    showFilters,
    searchTerm,
    filters,
    totalPages,
    startIndex,
    handleStatusChange,
    handleAction,
    handleExport,
    handlePageChange,
    handleSearchChange,
    handleFilterChange,
    handleToggleFilters,
  } = useOffers();

  return (
    <div className="space-y-6">
      <PageHeader onExport={handleExport} />
      
      <SearchAndFilters
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
          <OfferCard
            key={offer.id}
            offer={offer}
            onStatusChange={handleStatusChange}
            onAction={handleAction}
          />
        ))}
      </div>

      {/* Empty State */}
      {currentOffers.length === 0 && <EmptyState />}

      {/* Pagination */}
      <Pagination
        currentPage={1}
        totalPages={totalPages}
        totalItems={currentOffers.length}
        itemsPerPage={6}
        startIndex={startIndex}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
