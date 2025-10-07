import React, { useState } from "react";

import {
  useFinanceOffers,
  useFinanceFilters,
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
    updateFilteredOffers,
    filteredOffers,
  } = useFinanceOffers();

  const {
    searchTerm,
    setSearchTerm,
    showFilters,
    filters,
    handleFilterChange,
    clearFilters,
    toggleFilters,
  } = useFinanceFilters(filteredOffers, updateFilteredOffers);


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
    <div className="space-y-6">
      <Header onExportToExcel={handleExportToExcel} />

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

      <OffersGrid
        offers={currentOffers}
        onAction={(action, id) => {
          if (action === "edit") openExpensesModal(id);
          else handleAction(action, id);
        }}
      />

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
  );
}
