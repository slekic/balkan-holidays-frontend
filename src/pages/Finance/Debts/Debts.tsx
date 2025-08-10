import React from "react";
import {
  Header,
  SummaryCards,
  CriticalDebtsAlert,
  SearchAndFilters,
  DebtsTable,
  EmptyState,
  Pagination,
} from "./components";
import {
  useDebtOffers,
  useDebtFilters,
  useDebtPagination,
  useDebtActions,
} from "./hooks";
import { calculateDebtSummary } from "./utils";

export default function Debts() {
  const { offers, filteredOffers, totalFilteredOffers, updateFilteredOffers } =
    useDebtOffers();

  const {
    searchTerm,
    setSearchTerm,
    showFilters,
    filters,
    handleFilterChange,
    clearFilters,
    toggleFilters,
  } = useDebtFilters(offers, updateFilteredOffers);

  const {
    currentPage,
    totalPages,
    startIndex,
    currentOffers,
    itemsPerPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = useDebtPagination(filteredOffers);

  const { handleExportToExcel } = useDebtActions();

  // Calculate summary statistics
  const summary = calculateDebtSummary(filteredOffers);

  return (
    <div className="space-y-6">
      <Header onExportToExcel={handleExportToExcel} />
      
      <SummaryCards summary={summary} />
      
      <CriticalDebtsAlert criticalDebtsCount={summary.criticalDebts} />
      
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showFilters={showFilters}
        onToggleFilters={toggleFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />
      
      {totalFilteredOffers > 0 ? (
        <>
          <DebtsTable offers={currentOffers} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            itemsPerPage={itemsPerPage}
            totalItems={totalFilteredOffers}
            onPageChange={goToPage}
            onNextPage={goToNextPage}
            onPreviousPage={goToPreviousPage}
          />
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

