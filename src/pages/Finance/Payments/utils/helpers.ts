import { PaymentOffer } from './types';

export const calculatePaymentStats = (offers: PaymentOffer[]) => {
  const totalReceivable = offers.reduce((sum, offer) => sum + offer.totalPrice, 0);
  const totalReceived = offers.reduce((sum, offer) => sum + offer.totalPaid, 0);
  const totalOutstanding = totalReceivable - totalReceived;
  const collectionRate = totalReceivable > 0 ? Math.round((totalReceived / totalReceivable) * 100) : 0;

  return {
    totalReceivable,
    totalReceived,
    totalOutstanding,
    collectionRate
  };
};

export const calculatePaymentPercentage = (totalPaid: number, totalPrice: number) => {
  return (totalPaid / totalPrice) * 100;
};

export const calculateRemainingAmount = (totalPrice: number, totalPaid: number) => {
  return totalPrice - totalPaid;
};

export const formatCurrency = (amount: number) => {
  return `€${amount.toLocaleString()}`;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
