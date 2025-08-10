import React from "react";
import { PageHeader } from "./components/PageHeader";
import { SearchAndFilters } from "../AllOffers/components/SearchAndFilters";
import { FollowUpOfferCard } from "./components/FollowUpOfferCard";
import { Pagination } from "../AllOffers/components/Pagination";
import { EmptyState } from "../AllOffers/components/EmptyState";
import { useFollowUpOffers } from "./hooks/useFollowUpOffers";

export default function FollowUpOffers() {
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
  } = useFollowUpOffers();

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

      {/* Follow-up Offers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentOffers.map((offer) => (
          <FollowUpOfferCard
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
