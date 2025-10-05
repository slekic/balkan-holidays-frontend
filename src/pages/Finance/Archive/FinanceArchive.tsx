import React, { useState } from "react";

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
import { UserProvider } from "../../UserManagement/UserContext";
import { OfferViewCard } from "../../Archive/AllOffers/components/OfferViewCard";
import FinanceExpensesModal from "./ExpenseModal";
import { useFinanceExpenses } from "./hooks/useExpenses";

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

  const { handleAction, handleExportToExcel, viewPonuda, handleCloseView } =
    useFinanceActions(filteredOffers);

  // Modal state
  const [showExpensesModal, setShowExpensesModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  // Hook za rashode ponude
  const {
    expenses,
    handleAddExpense,
    handleUpdateExpense,
    handleRemoveExpense,
    totalExpenses,
    saveExpenses,
  } = useFinanceExpenses(selectedOfferId, showExpensesModal);

  // Otvori modal sa rashodima
  const openExpensesModal = (offerId: string) => {
    setSelectedOfferId(offerId);
    setShowExpensesModal(true);
  };

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

      {totalFilteredOffers === 0 && <EmptyState />}

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
