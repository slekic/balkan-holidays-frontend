import { useState, useMemo } from "react";
import { DebtOffer, DebtFilters } from "../utils/types";
import { filterOptions } from "../utils/constants";

export function useDebtFilters(
  offers: DebtOffer[],
  updateFilteredOffers: (offers: DebtOffer[]) => void
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<DebtFilters>({
    client: "",
    urgencyLevel: "",
    status: "",
    amountMin: "",
    amountMax: "",
    dateFrom: "",
    dateTo: "",
  });

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      // Search term filter
      const searchMatch =
        searchTerm === "" ||
        offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.client.toLowerCase().includes(searchTerm.toLowerCase());

      // Client filter
      const clientMatch = filters.client === "" || offer.client === filters.client;

      // Urgency level filter
      const urgencyMatch = filters.urgencyLevel === "" || offer.urgencyLevel === filters.urgencyLevel;

      // Status filter
      const statusMatch = filters.status === "" || offer.status === filters.status;

      // Amount range filter
      const amountMin = filters.amountMin ? parseFloat(filters.amountMin) : 0;
      const amountMax = filters.amountMax ? parseFloat(filters.amountMax) : Infinity;
      const amountMatch = offer.remainingAmount >= amountMin && offer.remainingAmount <= amountMax;

      return searchMatch && clientMatch && urgencyMatch && statusMatch && amountMatch;
    });
  }, [offers, searchTerm, filters]);

  const handleFilterChange = (key: keyof DebtFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      client: "",
      urgencyLevel: "",
      status: "",
      amountMin: "",
      amountMax: "",
      dateFrom: "",
      dateTo: "",
    });
    setSearchTerm("");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Update filtered offers whenever filters change
  useMemo(() => {
    updateFilteredOffers(filteredOffers);
  }, [filteredOffers, updateFilteredOffers]);

  return {
    searchTerm,
    setSearchTerm,
    showFilters,
    filters,
    filteredOffers,
    filterOptions,
    handleFilterChange,
    clearFilters,
    toggleFilters,
  };
}
