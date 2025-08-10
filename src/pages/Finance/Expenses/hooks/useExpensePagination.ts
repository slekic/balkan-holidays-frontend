import { useState, useCallback, useMemo } from "react";
import { Expense } from "../utils/types";
import { paginateExpenses } from "../utils/helpers";
import { ITEMS_PER_PAGE } from "../utils/constants";

export const useExpensePagination = (expenses: Expense[]) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { currentExpenses, totalPages, startIndex } = useMemo(() => {
    return paginateExpenses(expenses, currentPage, ITEMS_PER_PAGE);
  }, [expenses, currentPage]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  // Reset to first page when expenses change
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages,
    startIndex,
    currentExpenses,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    resetPagination,
  };
};

