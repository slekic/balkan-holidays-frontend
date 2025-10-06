// src/pages/AllOffers.tsx
import React from "react";
import { PageHeader } from "./components/PageHeader";
import { SearchAndFilters } from "./components/SearchAndFilters";
import { OfferCard } from "./components/OfferCard";
import { Pagination } from "./components/Pagination";
import { EmptyState } from "./components/EmptyState";
import { useOffers } from "./hooks/useOffers";
import { OfferViewCard } from "./components/OfferViewCard";
import { UserProvider } from "../../UserManagement/UserContext";

export default function AllOffers() {
  const {
    currentOffers,
    currentPage,
    showFilters,
    searchTerm,
    filters,
    totalPages,
    totalItems,
    itemsPerPage,
    pagesPerBatch,
    currentBatchNumber,
    viewPonuda,
    handleStatusChange,
    handleAction,
    handleExport,
    handlePageChange,
    handleSearchChange,
    handleFilterChange,
    handleToggleFilters,
    handleCloseView,
    handleApplyFilters,
    handleResetFilters,
  } = useOffers();

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

      {/* View Offer Modal */}
      {viewPonuda && (
        <OfferViewCard offer={viewPonuda} onClose={handleCloseView} />
      )}
    
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
