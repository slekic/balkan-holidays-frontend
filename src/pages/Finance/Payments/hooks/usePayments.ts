import { useState, useEffect, useCallback } from "react";
import { PaymentOffer } from "../utils/types";
import { fetchFinanceOffersWithPayments } from "../data/mockData";
import { mapPonudaFinanceWithPaymentsToOffer } from "../../../../utils/finance_response_mappers";
import { createPayment, deletePaymentApi, updatePaymentApi } from "../../../../api/finances";

export const usePayments = () => {
  const [offers, setOffers] = useState<PaymentOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<PaymentOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load offers from backend
  useEffect(() => {
    async function loadOffers() {
      setLoading(true);
      try {
        const data = await fetchFinanceOffersWithPayments();
        setOffers(data);
        setFilteredOffers(data);
      } catch (err) {
        console.error("Failed to fetch finance offers with payments:", err);
        setError("Failed to load offers");
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  const updateFilteredOffers = useCallback((newOffers: PaymentOffer[]) => {
    setFilteredOffers(newOffers);
  }, []);

  const addPayment = useCallback(
    async (
      offerId: string,
      payment: { amount: number; comment: string; method: string }
    ) => {
      try {
        const response = await createPayment(offerId, payment);

        const mappedPayment = mapPonudaFinanceWithPaymentsToOffer(response);

        setOffers(prevOffers =>
          prevOffers.map(offer => (offer.id === offerId ? mappedPayment : offer))
        );

        setFilteredOffers(prevFiltered =>
          prevFiltered.map(offer => (offer.id === offerId ? mappedPayment : offer))
        );
      } catch (err) {
        console.error("Failed to add payment", err);
      }
    },
    []
  );

  const updatePayment = useCallback(
    async (
      paymentId: string,
      payment: { amount: number; comment: string; method: string }
    ) => {
      try {
        const response = await updatePaymentApi(paymentId, payment);

        const mappedOffer = mapPonudaFinanceWithPaymentsToOffer(response);

        setOffers(prevOffers =>
          prevOffers.map(offer => (offer.id === mappedOffer.id ? mappedOffer : offer))
        );

        setFilteredOffers(prevFiltered =>
          prevFiltered.map(offer => (offer.id === mappedOffer.id ? mappedOffer : offer))
        );
      } catch (err) {
        console.error("Failed to update payment", err);
      }
    },
    []
  );

  const deletePayment = useCallback(
    async (paymentId: string) => {
      try {
        const response = await deletePaymentApi(paymentId);

        const mappedOffer = mapPonudaFinanceWithPaymentsToOffer(response);

        setOffers(prevOffers =>
          prevOffers.map(offer => (offer.id === mappedOffer.id ? mappedOffer : offer))
        );

        setFilteredOffers(prevFiltered =>
          prevFiltered.map(offer => (offer.id === mappedOffer.id ? mappedOffer : offer))
        );
      } catch (err) {
        console.error("Failed to delete payment", err);
      }
    },
    []
  );

  return {
    offers,
    filteredOffers,
    loading,
    error,
    updateFilteredOffers,
    addPayment,
    updatePayment,
    deletePayment,
  };
};
