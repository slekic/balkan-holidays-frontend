import { useState, useMemo } from 'react';
import { PaymentOffer } from '../utils/types';
import { ITEMS_PER_PAGE } from '../utils/constants';

export const usePaymentPagination = (filteredOffers: PaymentOffer[]) => {
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

  // Reset to first page when filtered results change
  useMemo(() => {
    setCurrentPage(1);
  }, [filteredOffers.length]);

  return {
    currentPage,
    totalPages,
    startIndex,
    currentOffers,
    goToPage,
    goToNextPage,
    goToPreviousPage
  };
};
