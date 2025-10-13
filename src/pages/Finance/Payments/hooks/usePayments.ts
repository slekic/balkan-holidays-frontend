import { useState, useEffect, useCallback } from "react";
import { PaymentFilters, PaymentOffer, PaymentSummary } from "../utils/types";
import {
  mapPonudaFinanceWithPaymentsToOffer,
} from "../../../../utils/finance_response_mappers";
import {
  createPayment,
  deletePaymentApi,
  getAllFinanceOffersWithPayments,
  updatePaymentApi,
} from "../../../../api/finances";
import { toast } from "react-toastify";

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
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [summary, setSummary] = useState<PaymentSummary>({
        totalOutstanding: 0,
        totalReceived: 0,
        totalReceivable: 0,
        collectionRate: 0
    });
  const [filters, setFilters] = useState<PaymentFilters>({
        client: "",
        dateFrom: "",
        dateTo: "",
        paymentStatus: ""
    });
  // --- Fetch batch of offers ---
  const fetchBatch = useCallback(async (batchNumber: number,
            filters: PaymentFilters,
            searchTerm: string
  ) => {
    setLoading(true);
    setError(null);
    const appliedFilters = {
      search: searchTerm,
      client: filters.client,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      paymentStatus: filters.paymentStatus   
    };
    try {
      const data = await getAllFinanceOffersWithPayments(batchNumber, BATCH_SIZE, appliedFilters);
      const mapped = data.items.map(mapPonudaFinanceWithPaymentsToOffer);
      setCurrentBatch(mapped);
      setFilteredOffers(mapped);
      setTotalItems(data.total);
      data.summary.collectionRate = data.summary.totalReceivable > 0 ? Math.round((data.summary.totalReceived / data.summary.totalReceivable) * 100) : 0;
      setSummary(data.summary);
    } catch (err) {
      console.error("Failed to fetch finance offers with payments:", err);
      setError("Greška pri učitavanju ponuda sa plaćanjima");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBatch(1, filters, searchTerm);
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
      await fetchBatch(newBatchNumber, filters, searchTerm);
      setCurrentBatchNumber(newBatchNumber);
    }
    setCurrentPage(page);
  };

  // --- Filter updates ---
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
    
  const handleFilterChange = (newFilters: PaymentFilters) => {
    setFilters(newFilters);
  };
      
  const handleResetFilters = async () => {
    const emptyFilters: PaymentFilters = {
      paymentStatus: "",
      client: "",
      dateFrom: "",
      dateTo: ""
    };
    setFilters(emptyFilters);
    setSearchTerm("");
    setShowFilters(false);
    await fetchBatch(1, emptyFilters, "");
    setCurrentBatchNumber(1);
    setCurrentPage(1);
  };
      
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };
    
  const handleApplyFilters = async (filters: PaymentFilters, searchTerm: string) => {
    await fetchBatch(1, filters, searchTerm);
    setCurrentBatchNumber(1);
    setCurrentPage(1);
  };

  // --- Payment CRUD ---
  const addPayment = useCallback(
    async (
      offerId: string,
      payment: { amount: number; comment: string; method: string }
    ) => {
      const response = await createPayment(offerId, payment);
      const mappedOffer = mapPonudaFinanceWithPaymentsToOffer(response);

      if (mappedOffer.payments.length > 0 &&
          mappedOffer.payments[mappedOffer.payments.length - 1].amount < payment.amount) {
         
            toast.warning("Pokušana uplata sa većim iznosom!");
      }

      setCurrentBatch((prev) =>
        prev.map((offer) => (offer.id === offerId ? mappedOffer : offer))
      );
      setFilteredOffers((prev) => {
      const updated = prev.map((offer) =>
        offer.id === offerId ? mappedOffer : offer
      );
      setSummary(recalculateSummary(updated));
      return updated;
    });
    },
    []
  );

  const recalculateSummary = (offers: PaymentOffer[]) => {
    const totalReceivable = offers.reduce((sum, offer) => sum + offer.totalPrice, 0);
    const totalReceived = offers.reduce((sum, offer) => sum + offer.totalPaid, 0);
    const totalOutstanding = totalReceivable - totalReceived;
    const collectionRate =
      totalReceivable > 0 ? Math.round((totalReceived / totalReceivable) * 100) : 0;

    return { totalReceived, totalOutstanding, collectionRate, totalReceivable };
  };


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
      setFilteredOffers((prev) => {
      const updated = prev.map((offer) =>
        offer.id === mappedOffer.id ? mappedOffer : offer
      );
      setSummary(recalculateSummary(updated));
      return updated;
    });
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
  };
};
