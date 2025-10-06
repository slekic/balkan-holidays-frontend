// src/pages/FollowUpOffers.tsx
import React from "react";
import { PageHeader } from "./components/PageHeader";
import { SearchAndFilters } from "../AllOffers/components/SearchAndFilters";
import { FollowUpOfferCard } from "./components/FollowUpOfferCard";
import { Pagination } from "../AllOffers/components/Pagination";
import { EmptyState } from "../AllOffers/components/EmptyState";
import { useFollowUpOffers } from "./hooks/useFollowUpOffers";
import { UserProvider } from "../../UserManagement/UserContext";

export default function FollowUpOffers() {
  const {
    currentOffers,
    currentPage,
    currentBatchNumber,
    totalPages,
    itemsPerPage,
    totalItems,
    pagesPerBatch,
    showFilters,
    searchTerm,
    filters,
    currentBatch,
    filteredOffers,
    handlePageChange,
    handleStatusChange,
    handleAction,
    handleExport,
    handleSearchChange,
    handleFilterChange,
    handleToggleFilters,
    handleApplyFilters,
    handleResetFilters,
  } = useFollowUpOffers();

  return (
    <div className="space-y-6">
      <PageHeader onExport={handleExport} />

      <UserProvider>
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          showFilters={showFilters}
          onToggleFilters={handleToggleFilters}
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleApplyFilters}
          onReset={handleResetFilters}
        />
      </UserProvider>

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
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        pagesPerBatch={pagesPerBatch}
        currentBatch={currentBatchNumber}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
