import { useState, useEffect } from 'react';
import { PaymentOffer } from '../utils/types';
import { mockPaymentOffers } from '../data/mockData';

export const usePayments = () => {
  const [offers, setOffers] = useState<PaymentOffer[]>(mockPaymentOffers);
  const [filteredOffers, setFilteredOffers] = useState<PaymentOffer[]>(mockPaymentOffers);

  const updateFilteredOffers = (newOffers: PaymentOffer[]) => {
    setFilteredOffers(newOffers);
  };

  const addPayment = (offerId: string, payment: { amount: number; comment: string; method: string }) => {
    const newPayment = {
      id: Date.now().toString(),
      amount: payment.amount,
      comment: payment.comment,
      method: payment.method,
      date: new Date().toISOString().split('T')[0]
    };

    setOffers(prevOffers => 
      prevOffers.map(offer => {
        if (offer.id === offerId) {
          const newTotalPaid = offer.totalPaid + payment.amount;
          let newPaymentStatus: 'Not Paid' | 'Partially Paid' | 'Fully Paid';
          
          if (newTotalPaid >= offer.totalPrice) {
            newPaymentStatus = 'Fully Paid';
          } else if (newTotalPaid > 0) {
            newPaymentStatus = 'Partially Paid';
          } else {
            newPaymentStatus = 'Not Paid';
          }

          return {
            ...offer,
            totalPaid: newTotalPaid,
            paymentStatus: newPaymentStatus,
            payments: [...offer.payments, newPayment]
          };
        }
        return offer;
      })
    );

    // Update filtered offers as well
    setFilteredOffers(prevFiltered => 
      prevFiltered.map(offer => {
        if (offer.id === offerId) {
          const newTotalPaid = offer.totalPaid + payment.amount;
          let newPaymentStatus: 'Not Paid' | 'Partially Paid' | 'Fully Paid';
          
          if (newTotalPaid >= offer.totalPrice) {
            newPaymentStatus = 'Fully Paid';
          } else if (newTotalPaid > 0) {
            newPaymentStatus = 'Partially Paid';
          } else {
            newPaymentStatus = 'Not Paid';
          }

          return {
            ...offer,
            totalPaid: newTotalPaid,
            paymentStatus: newPaymentStatus,
            payments: [...offer.payments, newPayment]
          };
        }
        return offer;
      })
    );
  };

  return {
    offers,
    filteredOffers,
    updateFilteredOffers,
    addPayment
  };
};

