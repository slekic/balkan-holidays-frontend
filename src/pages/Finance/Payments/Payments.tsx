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
import { UserProvider } from '../../UserManagement/UserContext';
import { NewPayment } from './utils';
import { toast } from 'react-toastify';

export default function Payments() {
  const { offers, addPayment, updatePayment, deletePayment } = usePayments();

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
    editPaymentId,
    openAddPaymentModal,
    closeAddPaymentModal,
    openPaymentHistoryModal,
    closePaymentHistoryModal,
    openEditPaymentModal,
    updateNewPayment,
    handleExportToExcel,
  } = usePaymentActions();

  const handleAddPayment = (offerId: string) => {
    try{
      if (newPayment.amount) {
        addPayment(offerId, {
          amount: parseFloat(newPayment.amount),
          comment: newPayment.comment,
          method: newPayment.method,
        });
        toast.success("Uplata je uspešno dodata");
        closeAddPaymentModal();
      }
    }catch (error) {
      console.error("Error adding payment:", error);
      toast.error("Greška pri dodavanju uplate");
    }
  };

  const handleUpdatePayment = (id: string, updated: NewPayment) => {
    try {
      console.log("Updating payment:", id, updated);
      updatePayment(id, {
        amount: Number(updated.amount),
        comment: updated.comment,
        method: updated.method,
      });

      toast.success("Uplata je uspešno ažurirana");
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("Greška pri ažuriranju uplate");
    }
  };

  const handleDeletePayment = (id: string) => {
    try {
      console.log("Deleting payment:", id);
      deletePayment(id);

      toast.success("Uplata je uspešno obrisana");
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast.error("Greška pri brisanju uplate");
    }
  };


  const currentOffer = offers.find(o => o.id === showPaymentHistory);

  return (
    <div className="space-y-6">
      <Header onExportToExcel={handleExportToExcel} />
      <SummaryCards offers={filteredOffers} />

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

      <PaymentsTable
        offers={currentOffers}
        onAddPayment={openAddPaymentModal}
        onViewPaymentHistory={openPaymentHistoryModal}
      />

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

      {/* Add / Edit Payment Modal */}
      <AddPaymentModal
        isOpen={!!showAddPayment}
        onClose={closeAddPaymentModal}
        newPayment={newPayment}
        onUpdatePayment={updateNewPayment}
        onSubmit={() => {
          if (editPaymentId) {
            handleUpdatePayment(editPaymentId, newPayment);
          } else {
            showAddPayment && handleAddPayment(showAddPayment);
          }
          closeAddPaymentModal();
        }}
        isEdit={!!editPaymentId}
      />

      {/* Payment History Modal */}
      <PaymentHistoryModal
        isOpen={!!showPaymentHistory}
        onClose={closePaymentHistoryModal}
        offer={currentOffer || null}
        openEditPaymentModal={openEditPaymentModal}
        onDelete={handleDeletePayment}
      />
    </div>
  );
}
