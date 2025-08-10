import React from "react";

import {
  useFinanceOffers,
  useFinanceFilters,
  useFinancePagination,
  useFinanceActions,
} from "./hooks";
import Header from "./components/Header";
import SearchAndFilters from "./components/SearchAndFilters";
import OffersGrid from "./components/OffersGrid";
import EmptyState from "./components/EmptyState";
import Pagination from "./components/Pagination";

export default function FinanceArchive() {
  const { offers, filteredOffers, totalFilteredOffers, updateFilteredOffers } =
    useFinanceOffers();

  const {
    searchTerm,
    setSearchTerm,
    showFilters,
    filters,
    handleFilterChange,
    clearFilters,
    toggleFilters,
  } = useFinanceFilters(offers, updateFilteredOffers);

  const {
    currentPage,
    totalPages,
    startIndex,
    currentOffers,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = useFinancePagination(filteredOffers);

  const { handleAction, handleExportToExcel } = useFinanceActions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header onExportToExcel={handleExportToExcel} />

      {/* Search and Filter Bar */}
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showFilters={showFilters}
        onToggleFilters={toggleFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      {/* Offers Grid */}
      <OffersGrid offers={currentOffers} onAction={handleAction} />

      {/* Empty State */}
      {totalFilteredOffers === 0 && <EmptyState />}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        itemsPerPage={6}
        totalItems={totalFilteredOffers}
        onPageChange={goToPage}
        onNextPage={goToNextPage}
        onPreviousPage={goToPreviousPage}
      />
    </div>
  );
}
