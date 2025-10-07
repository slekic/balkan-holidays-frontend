import React, { useState } from "react";

import {
  useFinanceOffers,
  useFinanceActions,
} from "./hooks";
import Header from "./components/Header";
import SearchAndFilters from "./components/SearchAndFilters";
import OffersGrid from "./components/OffersGrid";
import EmptyState from "./components/EmptyState";
import Pagination from "./components/Pagination";
import { UserProvider } from "../../UserManagement/UserContext";
import { OfferViewCard } from "../../Archive/AllOffers/components/OfferViewCard";
import FinanceExpensesModal from "./ExpenseModal";
import { useFinanceExpenses } from "./hooks/useExpenses";

export default function FinanceArchive() {
  // ---------------- HOOKOVI ----------------
  const {
    currentOffers,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    pagesPerBatch,
    currentBatchNumber,
    handlePageChange,
    filteredOffers,
    handleSearchChange,
    handleFilterChange,
    handleToggleFilters,
    handleApplyFilters,
    handleResetFilters,
    showFilters,
    searchTerm,
    filters,
  } = useFinanceOffers();

  const { handleAction, handleExportToExcel, viewPonuda, handleCloseView } =
    useFinanceActions(currentOffers);

  // ---------------- MODAL ----------------
  const [showExpensesModal, setShowExpensesModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  const {
    expenses,
    handleAddExpense,
    handleUpdateExpense,
    handleRemoveExpense,
    saveExpenses,
  } = useFinanceExpenses(selectedOfferId, showExpensesModal);

  const openExpensesModal = (offerId: string) => {
    setSelectedOfferId(offerId);
    setShowExpensesModal(true);
  };

  // ---------------- RENDER ----------------
  return (
    <>
    <div className="space-y-6">
      <Header onExportToExcel={handleExportToExcel} />

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

      <OffersGrid
        offers={currentOffers}
        onAction={(action, id) => {
          if (action === "edit") openExpensesModal(id);
          else handleAction(action, id);
        }}
      />

      {totalItems === 0 && <EmptyState />}

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
    {viewPonuda && <OfferViewCard offer={viewPonuda} onClose={handleCloseView} />}

      <FinanceExpensesModal
        open={showExpensesModal}
        offerId={selectedOfferId}
        onClose={() => setShowExpensesModal(false)}
        expenses={expenses}
        handleAddExpense={handleAddExpense}
        handleUpdateExpense={handleUpdateExpense}
        handleRemoveExpense={handleRemoveExpense}
        saveExpenses={saveExpenses}
      />
    </>
  );
}
