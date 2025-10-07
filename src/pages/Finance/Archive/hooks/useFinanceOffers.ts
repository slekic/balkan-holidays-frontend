import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { FinanceOffer } from "../utils/types";
import { getAllFinanceOffers } from "../../../../api/finances";
import { mapPonudaFinanceToOffer } from "../../../../utils/finance_response_mappers";

const ITEMS_PER_PAGE = 2;
const PAGES_PER_BATCH = 5;
const BATCH_SIZE = ITEMS_PER_PAGE * PAGES_PER_BATCH;

export function useFinanceOffers() {
  const [currentBatch, setCurrentBatch] = useState<FinanceOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<FinanceOffer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBatchNumber, setCurrentBatchNumber] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------------- FETCH BATCH ----------------
  const fetchBatch = async (batchNumber: number) => {
    setLoading(true);
    try {
      console.log("GET SA ", batchNumber)
      console.log("GET sa ", BATCH_SIZE)
      const data = await getAllFinanceOffers(batchNumber, BATCH_SIZE);
      const mapped = data.items.map(mapPonudaFinanceToOffer);
      setCurrentBatch(mapped);
      setFilteredOffers(mapped);
      setTotalItems(data.total);
    } catch (err) {
      console.error("Failed to fetch finance offers:", err);
      setError("Greška pri učitavanju finansijskih ponuda");
      toast.error("Greška pri učitavanju finansijskih ponuda");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatch(1);
  }, []);

  // ---------------- PAGINATION ----------------
  const localPage =
    currentPage % PAGES_PER_BATCH === 0
      ? PAGES_PER_BATCH
      : currentPage % PAGES_PER_BATCH;

  const startIndex = (localPage - 1) * ITEMS_PER_PAGE;
  const currentOffers = filteredOffers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handlePageChange = async (page: number) => {
    const newBatchModulo = page % PAGES_PER_BATCH;
    if (newBatchModulo === 1 || newBatchModulo === 0) {
      const newBatchNumber = Math.ceil(page / PAGES_PER_BATCH);
      await fetchBatch(newBatchNumber);
      setCurrentBatchNumber(newBatchNumber);
    }
    setCurrentPage(page);
  };

  // ---------------- TOTALS ----------------
  const totalValue = useMemo(
    () => filteredOffers.reduce((sum, o) => sum + o.totalPrice, 0),
    [filteredOffers]
  );
  const totalPaid = useMemo(
    () => filteredOffers.reduce((sum, o) => sum + o.totalPaid, 0),
    [filteredOffers]
  );
  const totalOutstanding = useMemo(
    () => totalValue - totalPaid,
    [totalValue, totalPaid]
  );

  // ---------------- FILTERING ----------------
  const updateFilteredOffers = useCallback((newFilteredOffers: FinanceOffer[]) => {
    setFilteredOffers(newFilteredOffers);
  }, []);

  // ---------------- BATCH & TOTALS UPDATE ----------------
  const updateBatchAndTotals = (newBatch: FinanceOffer[], total?: number) => {
    setCurrentBatch(newBatch);
    setFilteredOffers(newBatch);
    if (total !== undefined) setTotalItems(total);
  };

  return {
    currentOffers,
    currentPage,
    currentBatchNumber,
    totalPages,
    totalItems,
    itemsPerPage: ITEMS_PER_PAGE,
    pagesPerBatch: PAGES_PER_BATCH,
    totalValue,
    totalPaid,
    totalOutstanding,
    loading,
    error,
    handlePageChange,
    updateFilteredOffers,
    updateBatchAndTotals,
    filteredOffers
  };
}
