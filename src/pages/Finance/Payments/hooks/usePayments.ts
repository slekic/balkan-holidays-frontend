import { useState, useEffect, useCallback } from "react";
import { PaymentOffer } from "../utils/types";
import {
  mapPonudaFinanceWithPaymentsToOffer,
} from "../../../../utils/finance_response_mappers";
import {
  createPayment,
  deletePaymentApi,
  getAllFinanceOffersWithPayments,
  updatePaymentApi,
} from "../../../../api/finances";

const ITEMS_PER_PAGE = 8;
const PAGES_PER_BATCH = 5;
const BATCH_SIZE = ITEMS_PER_PAGE * PAGES_PER_BATCH;

export const usePayments = () => {
  // --- State ---
  const [currentBatch, setCurrentBatch] = useState<PaymentOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<PaymentOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentBatchNumber, setCurrentBatchNumber] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  // --- Fetch batch of offers ---
  const fetchBatch = useCallback(async (batchNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllFinanceOffersWithPayments(batchNumber, BATCH_SIZE);
      const mapped = data.items.map(mapPonudaFinanceWithPaymentsToOffer);
      setCurrentBatch(mapped);
      setFilteredOffers(mapped);
      setTotalItems(data.total);
    } catch (err) {
      console.error("Failed to fetch finance offers with payments:", err);
      setError("Greška pri učitavanju ponuda sa plaćanjima");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBatch(1);
  }, [fetchBatch]);

  // --- Pagination logic ---
  const localPage =
    currentPage % PAGES_PER_BATCH === 0
      ? PAGES_PER_BATCH
      : currentPage % PAGES_PER_BATCH;

  const startIndex = (localPage - 1) * ITEMS_PER_PAGE;
  const currentOffers = filteredOffers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handlePageChange = async (page: number) => {
    const newBatchNumber = Math.ceil(page / PAGES_PER_BATCH);
    if (newBatchNumber !== currentBatchNumber) {
      await fetchBatch(newBatchNumber);
      setCurrentBatchNumber(newBatchNumber);
    }
    setCurrentPage(page);
  };

  // --- Filter updates ---
  const updateFilteredOffers = useCallback((newOffers: PaymentOffer[]) => {
    setFilteredOffers(newOffers);
  }, []);

  // --- Payment CRUD ---
  const addPayment = useCallback(
    async (
      offerId: string,
      payment: { amount: number; comment: string; method: string }
    ) => {
      const response = await createPayment(offerId, payment);
      const mappedOffer = mapPonudaFinanceWithPaymentsToOffer(response);
      setCurrentBatch((prev) =>
        prev.map((offer) => (offer.id === offerId ? mappedOffer : offer))
      );
      setFilteredOffers((prev) =>
        prev.map((offer) => (offer.id === offerId ? mappedOffer : offer))
      );
    },
    []
  );

  const updatePayment = useCallback(
    async (
      paymentId: string,
      payment: { amount: number; comment: string; method: string }
    ) => {
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
    },
    []
  );

  const deletePayment = useCallback(async (paymentId: string) => {
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
  }, []);

  // --- Return all ---
  return {
    currentOffers, // only 2 per page
    filteredOffers,
    currentBatch,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage: ITEMS_PER_PAGE,
    pagesPerBatch: PAGES_PER_BATCH,
    currentBatchNumber,
    handlePageChange,
    updateFilteredOffers,
    addPayment,
    updatePayment,
    deletePayment,
  };
};
