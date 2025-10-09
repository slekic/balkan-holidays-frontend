import React from "react";
import {
  Header,
  SummaryCard,
  SearchAndFilters,
  ExpensesTable,
  EmptyState,
} from "./components";
import { useExpenses, useExpenseActions } from "./hooks";
import { calculateExpenseSummary } from "./utils";
import { UserProvider } from "../../UserManagement/UserContext";
import Pagination from "./components/Pagination";

export default function Expenses() {
  const {
    currentBatch,
    currentExpenses,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    pagesPerBatch,
    currentBatchNumber,
    handlePageChange,
    handleSearchChange,
    handleFilterChange,
    handleToggleFilters,
    handleApplyFilters,
    handleResetFilters,
    showFilters,
    searchTerm,
    filters,
    summary
  } = useExpenses();

  const { handleViewFile, handleExportToExcel } = useExpenseActions(currentExpenses);

  return (
    <div className="space-y-6">
      <Header onExportToExcel={handleExportToExcel} />
      <SummaryCard summary={summary} />

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

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : currentExpenses.length === 0 ? (
        <EmptyState />
      ) : (
        <ExpensesTable expenses={currentExpenses} onViewFile={handleViewFile} />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        pagesPerBatch={pagesPerBatch}
        currentBatch={currentBatchNumber}
        onPageChange={(page) => handlePageChange(page)}
      />
    </div>
  );
}
