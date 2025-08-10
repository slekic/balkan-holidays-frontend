import { useState, useMemo } from "react";
import { DebtOffer } from "../utils/types";
import { ITEMS_PER_PAGE } from "../utils/constants";

export function useDebtPagination(filteredOffers: DebtOffer[]) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredOffers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOffers = filteredOffers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  // Reset to first page when filtered offers change
  useMemo(() => {
    setCurrentPage(1);
  }, [filteredOffers.length]);

  return {
    currentPage,
    totalPages,
    startIndex,
    currentOffers,
    itemsPerPage: ITEMS_PER_PAGE,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
  };
}
