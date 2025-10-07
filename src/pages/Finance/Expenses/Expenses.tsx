import React from "react";
import {
  Header,
  SummaryCard,
  SearchAndFilters,
  ExpensesTable,
  EmptyState,
} from "./components";
import { useExpenses, useExpenseFilters, useExpenseActions } from "./hooks";
import { calculateExpenseSummary } from "./utils";
import { UserProvider } from "../../UserManagement/UserContext";
import Pagination from "./components/Pagination";

export default function Expenses() {
  const {
    currentBatch,
    filteredExpenses,
    updateFilteredExpenses,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    pagesPerBatch,
    currentBatchNumber,
    handlePageChange,
  } = useExpenses();

  const {
    searchTerm,
    setSearchTerm,
    showFilters,
    filters,
    handleFilterChange,
    clearFilters,
    toggleFilters,
  } = useExpenseFilters(filteredExpenses, updateFilteredExpenses);

  const { handleViewFile, handleExportToExcel } = useExpenseActions(filteredExpenses);

  const summary = calculateExpenseSummary(filteredExpenses);

  return (
    <div className="space-y-6">
      <Header onExportToExcel={handleExportToExcel} />
      <SummaryCard summary={summary} />

      <UserProvider>
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showFilters={showFilters}
          onToggleFilters={toggleFilters}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />
      </UserProvider>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredExpenses.length === 0 ? (
        <EmptyState />
      ) : (
        <ExpensesTable expenses={currentBatch} onViewFile={handleViewFile} />
      )}

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
