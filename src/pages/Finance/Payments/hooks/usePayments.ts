import { useState, useEffect, useCallback } from "react";
import { PaymentOffer } from "../utils/types";
import { fetchFinanceOffersWithPayments } from "../data/mockData";
import {
  mapPonudaFinanceWithPaymentsToOffer,
} from "../../../../utils/finance_response_mappers";
import {
  createPayment,
  deletePaymentApi,
  getAllFinanceOffersWithPayments,
  updatePaymentApi,
} from "../../../../api/finances";

export const usePayments = () => {
  // --- State ---
  const [currentBatch, setCurrentBatch] = useState<PaymentOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<PaymentOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(2);
  const [pagesPerBatch] = useState<number>(5);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentBatchNumber, setCurrentBatchNumber] = useState<number>(1);

  // --- Load offers ---
  const loadOffers = useCallback(
    async (page: number = 1) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllFinanceOffersWithPayments(page, itemsPerPage);
        const mapped = data.items.map(mapPonudaFinanceWithPaymentsToOffer);
        setCurrentBatch(mapped);
        setFilteredOffers(mapped);
        const total = data.total;
        setTotalItems(total);
        setTotalPages(Math.ceil(total / itemsPerPage));
        setCurrentPage(page);
      } catch (err) {
        console.error("Failed to fetch finance offers with payments:", err);
        setError("Failed to load offers");
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage]
  );

  useEffect(() => {
    loadOffers(1);
  }, [loadOffers]);

  // --- Pagination handlers ---
  const handlePageChange = async (page: number) => {
    await loadOffers(page);
  };

  // --- Filtered updates ---
  const updateFilteredOffers = useCallback((newOffers: PaymentOffer[]) => {
    setFilteredOffers(newOffers);
  }, []);

  // --- Payment CRUD ---
  const addPayment = useCallback(
    async (
      offerId: string,
      payment: { amount: number; comment: string; method: string }
    ) => {
      try {
        const response = await createPayment(offerId, payment);
        const mappedOffer = mapPonudaFinanceWithPaymentsToOffer(response);

        setCurrentBatch((prev) =>
          prev.map((offer) =>
            offer.id === offerId ? mappedOffer : offer
          )
        );

        setFilteredOffers((prev) =>
          prev.map((offer) =>
            offer.id === offerId ? mappedOffer : offer
          )
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(message);
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

        setCurrentBatch((prev) =>
          prev.map((offer) =>
            offer.id === mappedOffer.id ? mappedOffer : offer
          )
        );

        setFilteredOffers((prev) =>
          prev.map((offer) =>
            offer.id === mappedOffer.id ? mappedOffer : offer
          )
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(message);
      }
    },
    []
  );

  const deletePayment = useCallback(async (paymentId: string) => {
    try {
      const response = await deletePaymentApi(paymentId);
      const mappedOffer = mapPonudaFinanceWithPaymentsToOffer(response);

      setCurrentBatch((prev) =>
        prev.map((offer) =>
          offer.id === mappedOffer.id ? mappedOffer : offer
        )
      );

      setFilteredOffers((prev) =>
        prev.map((offer) =>
          offer.id === mappedOffer.id ? mappedOffer : offer
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(message);
    }
  }, []);

  // --- Return all ---
  return {
    currentBatch,
    filteredOffers,
    updateFilteredOffers,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    pagesPerBatch,
    currentBatchNumber,
    setCurrentBatchNumber,
    handlePageChange,
    addPayment,
    updatePayment,
    deletePayment,
  };
};
