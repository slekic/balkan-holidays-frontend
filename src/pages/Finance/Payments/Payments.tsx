import React from "react";
import {
  usePayments,
  usePaymentActions,
} from "./hooks";
import {
  Header,
  SummaryCards,
  SearchAndFilters,
  PaymentsTable,
  AddPaymentModal,
  PaymentHistoryModal,
  Pagination,
} from "./components";
import { UserProvider } from "../../UserManagement/UserContext";
import { NewPayment } from "./utils";
import { toast } from "react-toastify";

export default function Payments() {
  const {
    currentOffers,
    filteredOffers,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    pagesPerBatch,
    currentBatchNumber,
    handlePageChange,
    addPayment,
    updatePayment,
    deletePayment,
    handleSearchChange,
    handleFilterChange,
    handleToggleFilters,
    handleApplyFilters,
    handleResetFilters,
    showFilters,
    searchTerm,
    filters,
    summary
  } = usePayments();

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
  } = usePaymentActions(filteredOffers);

  const handleAddPayment = async (offerId: string) => {
    try {
      if (newPayment.amount) {
        await addPayment(offerId, {
          amount: parseFloat(newPayment.amount),
          comment: newPayment.comment,
          method: newPayment.method,
        });
        toast.success("Uplata je uspešno dodata");
        closeAddPaymentModal();
      }
    } catch (error) {
      console.error("Error adding payment:", error);
      toast.error("Greška pri dodavanju uplate");
    }
  };

  const handleUpdatePayment = async (id: string, updated: NewPayment) => {
    try {
      await updatePayment(id, {
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

  const handleDeletePayment = async (id: string) => {
    try {
      await deletePayment(id);
      toast.success("Uplata je uspešno obrisana");
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast.error("Greška pri brisanju uplate");
    }
  };

  const currentOffer = currentOffers.find(
    (o) => o.id === showPaymentHistory
  );

  return (
    <>
    <div className="space-y-6">
      <Header onExportToExcel={handleExportToExcel} />
      <SummaryCards summary={summary} />

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
      ) : (
        <PaymentsTable
          offers={currentOffers}
          onAddPayment={openAddPaymentModal}
          onViewPaymentHistory={openPaymentHistoryModal}
        />
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
      <AddPaymentModal
        isOpen={!!showAddPayment}
        onClose={closeAddPaymentModal}
        newPayment={newPayment}
        onUpdatePayment={updateNewPayment}
        onSubmit={() => {
          if (editPaymentId) handleUpdatePayment(editPaymentId, newPayment);
          else showAddPayment && handleAddPayment(showAddPayment);
          closeAddPaymentModal();
        }}
        isEdit={!!editPaymentId}
      />

      <PaymentHistoryModal
        isOpen={!!showPaymentHistory}
        onClose={closePaymentHistoryModal}
        offer={currentOffer || null}
        openEditPaymentModal={openEditPaymentModal}
        onDelete={handleDeletePayment}
      />
     </>
  );
}
