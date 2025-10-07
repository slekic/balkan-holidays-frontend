import { useState, useEffect, useCallback, useMemo } from "react";
import { Expense } from "../utils/types";
import { getAllExpenses } from "../../../../api/finances";
import { mapPonudaNaExpense } from "../../../../utils/finance_response_mappers";

const ITEMS_PER_PAGE = 2;
const PAGES_PER_BATCH = 3;
const BATCH_SIZE = ITEMS_PER_PAGE * PAGES_PER_BATCH;

export const useExpenses = () => {
  const [currentBatch, setCurrentBatch] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentBatchNumber, setCurrentBatchNumber] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  // ---------------- FETCH BATCH ----------------
  const fetchBatch = async (batchNumber: number) => {
    setLoading(true);
    try {
      const data = await getAllExpenses(batchNumber, BATCH_SIZE);
      const mapped = data.items.map(mapPonudaNaExpense);
      setCurrentBatch(mapped);
      setFilteredExpenses(mapped);
      setTotalItems(data.total);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      setError("Greška pri učitavanju troškova");
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
  const currentExpenses = currentBatch.slice(
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

  // ---------------- FILTERING ----------------
  const updateFilteredExpenses = useCallback((newFiltered: Expense[]) => {
    setFilteredExpenses(newFiltered);
  }, []);

  return {
    currentBatch,
    currentExpenses,
    updateFilteredExpenses,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage: ITEMS_PER_PAGE,
    pagesPerBatch: PAGES_PER_BATCH,
    currentBatchNumber,
    handlePageChange,
  };
};
