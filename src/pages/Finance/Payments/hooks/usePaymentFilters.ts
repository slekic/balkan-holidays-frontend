import { useState, useMemo } from 'react';
import { PaymentOffer, PaymentFilters } from '../utils/types';

export const usePaymentFilters = (offers: PaymentOffer[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<PaymentFilters>({
    client: '',
    paymentStatus: '',
    dateFrom: '',
    dateTo: ''
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (key: keyof PaymentFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      client: '',
      paymentStatus: '',
      dateFrom: '',
      dateTo: ''
    });
    setSearchTerm('');
  };

  // Apply filters and search
  const filteredOffers = useMemo(() => {
    let filtered = offers;

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(offer =>
        offer.name.toLowerCase().includes(searchLower) ||
        offer.code.toLowerCase().includes(searchLower) ||
        offer.client.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    if (filters.client) {
      filtered = filtered.filter(offer => offer.client === filters.client);
    }

    if (filters.paymentStatus) {
      filtered = filtered.filter(offer => offer.paymentStatus === filters.paymentStatus);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(offer => offer.createdAt >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(offer => offer.createdAt <= filters.dateTo);
    }

    return filtered;
  }, [offers, searchTerm, filters]);

  return {
    searchTerm,
    setSearchTerm,
    showFilters,
    filters,
    filteredOffers,
    handleFilterChange,
    clearFilters,
    toggleFilters
  };
};
