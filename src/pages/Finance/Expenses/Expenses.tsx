import React, { useEffect } from "react";
import {
  Header,
  SummaryCard,
  SearchAndFilters,
  ExpensesTable,
  EmptyState,
  Pagination,
} from "./components";
import {
  useExpenses,
  useExpenseFilters,
  useExpensePagination,
  useExpenseActions,
} from "./hooks";
import { calculateExpenseSummary } from "./utils";

export default function Expenses() {
  const { expenses, filteredExpenses, updateFilteredExpenses } = useExpenses();

  const {
    searchTerm,
    setSearchTerm,
    showFilters,
    filters,
    handleFilterChange,
    clearFilters,
    toggleFilters,
  } = useExpenseFilters(expenses, updateFilteredExpenses);

  const {
    currentPage,
    totalPages,
    startIndex,
    currentExpenses,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    resetPagination,
  } = useExpensePagination(filteredExpenses);

  const { handleViewFile, handleExportToExcel } = useExpenseActions();

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination();
  }, [filteredExpenses, resetPagination]);

  const summary = calculateExpenseSummary(filteredExpenses);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header onExportToExcel={handleExportToExcel} />

      {/* Summary Card */}
      <SummaryCard summary={summary} />

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

      {/* Expenses Table */}
      <ExpensesTable
        expenses={currentExpenses}
        onViewFile={handleViewFile}
      />

      {/* Empty State */}
      {filteredExpenses.length === 0 && <EmptyState />}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        itemsPerPage={10}
        totalItems={filteredExpenses.length}
        onPageChange={goToPage}
        onNextPage={goToNextPage}
        onPreviousPage={goToPreviousPage}
      />
    </div>
  );
}

