import React from 'react';
import {
  usePayments,
  usePaymentFilters,
  usePaymentPagination,
  usePaymentActions,
} from './hooks';
import {
  Header,
  SummaryCards,
  SearchAndFilters,
  PaymentsTable,
  AddPaymentModal,
  PaymentHistoryModal,
  Pagination,
} from './components';
import { ITEMS_PER_PAGE } from './utils/constants';

export default function Payments() {
  const { offers, addPayment } = usePayments();

  const {
    searchTerm,
    setSearchTerm,
    showFilters,
    filters,
    filteredOffers,
    handleFilterChange,
    clearFilters,
    toggleFilters,
  } = usePaymentFilters(offers);

  const {
    currentPage,
    totalPages,
    startIndex,
    currentOffers,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePaymentPagination(filteredOffers);

  const {
    showAddPayment,
    showPaymentHistory,
    newPayment,
    openAddPaymentModal,
    closeAddPaymentModal,
    openPaymentHistoryModal,
    closePaymentHistoryModal,
    updateNewPayment,
    handleExportToExcel,
  } = usePaymentActions();

  const handleAddPayment = (offerId: string) => {
    if (newPayment.amount && newPayment.comment) {
      addPayment(offerId, {
        amount: parseFloat(newPayment.amount),
        comment: newPayment.comment,
        method: newPayment.method,
      });
      closeAddPaymentModal();
    }
  };

  const currentOffer = offers.find(o => o.id === showPaymentHistory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header onExportToExcel={handleExportToExcel} />

      {/* Summary Cards */}
      <SummaryCards offers={filteredOffers} />

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

      {/* Payments Table */}
      <PaymentsTable
        offers={currentOffers}
        onAddPayment={openAddPaymentModal}
        onViewPaymentHistory={openPaymentHistoryModal}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={filteredOffers.length}
        onPageChange={goToPage}
        onNextPage={goToNextPage}
        onPreviousPage={goToPreviousPage}
      />

      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={!!showAddPayment}
        onClose={closeAddPaymentModal}
        newPayment={newPayment}
        onUpdatePayment={updateNewPayment}
        onSubmit={() => showAddPayment && handleAddPayment(showAddPayment)}
      />

      {/* Payment History Modal */}
      <PaymentHistoryModal
        isOpen={!!showPaymentHistory}
        onClose={closePaymentHistoryModal}
        offer={currentOffer || null}
      />
    </div>
  );
}
