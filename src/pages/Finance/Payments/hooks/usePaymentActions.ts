import { useState } from 'react';
import { NewPayment } from '../utils/types';

export const usePaymentActions = () => {
  const [showAddPayment, setShowAddPayment] = useState<string | null>(null);
  const [showPaymentHistory, setShowPaymentHistory] = useState<string | null>(null);
  const [newPayment, setNewPayment] = useState<NewPayment>({
    amount: '',
    comment: '',
    method: 'Bank Transfer'
  });

  const openAddPaymentModal = (offerId: string) => {
    setShowAddPayment(offerId);
    setNewPayment({ amount: '', comment: '', method: 'Bank Transfer' });
  };

  const closeAddPaymentModal = () => {
    setShowAddPayment(null);
    setNewPayment({ amount: '', comment: '', method: 'Bank Transfer' });
  };

  const openPaymentHistoryModal = (offerId: string) => {
    setShowPaymentHistory(offerId);
  };

  const closePaymentHistoryModal = () => {
    setShowPaymentHistory(null);
  };

  const updateNewPayment = (field: keyof NewPayment, value: string) => {
    setNewPayment(prev => ({ ...prev, [field]: value }));
  };

  const handleExportToExcel = () => {
    console.log('Exporting payments to Excel...');
    // TODO: Implement Excel export functionality
  };

  return {
    showAddPayment,
    showPaymentHistory,
    newPayment,
    openAddPaymentModal,
    closeAddPaymentModal,
    openPaymentHistoryModal,
    closePaymentHistoryModal,
    updateNewPayment,
    handleExportToExcel
  };
};
