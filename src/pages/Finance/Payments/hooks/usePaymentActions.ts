import { useState } from 'react';
import { NewPayment, Payment, PaymentOffer } from '../utils/types';
import { exportSelectedOffersPayments } from '../../../../api/export';
import { toast } from 'react-toastify';

export const usePaymentActions = (filteredOffers: PaymentOffer[]) => {
  const [showAddPayment, setShowAddPayment] = useState<string | null>(null);
  const [showPaymentHistory, setShowPaymentHistory] = useState<string | null>(null);
  const [editPaymentId, setEditPaymentId] = useState<string | null>(null);

  const [newPayment, setNewPayment] = useState<NewPayment>({
    amount: '',
    comment: '',
    method: 'Bank Transfer'
  });

  const openAddPaymentModal = (offerId: string) => {
    setShowAddPayment(offerId);
    setEditPaymentId(null);
    setNewPayment({ amount: '', comment: '', method: 'Bank Transfer' });
  };

  const closeAddPaymentModal = () => {
    setShowAddPayment(null);
    setEditPaymentId(null);
    setNewPayment({ amount: '', comment: '', method: 'Bank Transfer' });
  };

  const openPaymentHistoryModal = (offerId: string) => {
    setShowPaymentHistory(offerId);
  };

  const closePaymentHistoryModal = () => {
    setShowPaymentHistory(null);
  };

  const openEditPaymentModal = (payment: Payment) => {
    setEditPaymentId(payment.id);
    setNewPayment({
      amount: payment.amount.toString(),
      comment: payment.comment,
      method: payment.method,
    });
    setShowAddPayment(payment.id);
    setShowPaymentHistory(null);
  };

  const updateNewPayment = (field: keyof NewPayment, value: string) => {
    setNewPayment(prev => ({ ...prev, [field]: value }));
  };

  const deletePayment = async (id: string) => {
    console.log('Deleting payment:', id);
    // TODO: pozovi API ili update state
  };

  const handleExportToExcel = async () => {
        if (!filteredOffers || filteredOffers.length === 0) {
          console.warn("Nema ponuda za export");
          return;
        }
    
        const offersIds = filteredOffers.map((offer) => Number(offer.id));
        try {
          await exportSelectedOffersPayments(offersIds);
        } catch (err) {
          console.log("Greška prilikom exporta ponuda:", err)
          toast.error("Greška prilikom exporta ponuda");
        }
    };

  return {
    showAddPayment,
    showPaymentHistory,
    editPaymentId,
    newPayment,
    openAddPaymentModal,
    closeAddPaymentModal,
    openPaymentHistoryModal,
    closePaymentHistoryModal,
    openEditPaymentModal,
    updateNewPayment,
    deletePayment,
    handleExportToExcel,
  };
};
