import { useState, useEffect, useCallback } from "react";
import { Expense } from "../utils/types";
import { fetchExpenses } from "../data/mockData";
import { getAllExpenses } from "../../../../api/finances";
import { mapPonudaNaExpense } from "../../../../utils/finance_response_mappers";

export const useExpenses = () => {
  const [currentBatch, setCurrentBatch] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [pagesPerBatch] = useState<number>(3);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentBatchNumber, setCurrentBatchNumber] = useState<number>(1);

  const loadExpenses = useCallback(
    async (page: number = 1) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllExpenses(page, itemsPerPage);
        const mapped = data.items.map(mapPonudaNaExpense);
        setCurrentBatch(mapped); 
        setFilteredExpenses(mapped);
        setTotalItems(data.total);
        setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
        setCurrentPage(page);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
        setError("Failed to fetch expenses");
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage]
  );

  useEffect(() => {
    loadExpenses(1);
  }, [loadExpenses]);

  const handlePageChange = async (page: number) => {
    await loadExpenses(page);
  };

  const updateFilteredExpenses = (newFiltered: Expense[]) => {
    setFilteredExpenses(newFiltered);
  };

  return {
    currentBatch,
    filteredExpenses,
    updateFilteredExpenses,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    pagesPerBatch,
    currentBatchNumber,
    handlePageChange,
  };
};
