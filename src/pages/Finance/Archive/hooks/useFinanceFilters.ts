import { useState, useMemo } from "react";
import { FinanceOffer, FinanceFilters } from "../utils/types";
import { filterOptions } from "../utils/constants";

export function useFinanceFilters(offers: FinanceOffer[], updateFilteredOffers: (offers: FinanceOffer[]) => void) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FinanceFilters>({
    client: "",
    createdBy: "",
    status: "",
    paymentStatus: "",
    personsMin: "",
    personsMax: "",
    priceMin: "",
    priceMax: "",
    dateFrom: "",
    dateTo: "",
  });

  const filteredOffers = useMemo(() => {
    let filtered = offers;

    // Search by name or code
    if (searchTerm) {
      filtered = filtered.filter(
        (offer) =>
          offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.client) {
      filtered = filtered.filter((offer) => offer.client === filters.client);
    }

    if (filters.createdBy) {
      filtered = filtered.filter((offer) => offer.createdBy === filters.createdBy);
    }

    if (filters.status) {
      filtered = filtered.filter((offer) => offer.status === filters.status);
    }

    if (filters.paymentStatus) {
      filtered = filtered.filter((offer) => offer.paymentStatus === filters.paymentStatus);
    }

    if (filters.personsMin) {
      filtered = filtered.filter((offer) => offer.numberOfPersons >= parseInt(filters.personsMin));
    }

    if (filters.personsMax) {
      filtered = filtered.filter((offer) => offer.numberOfPersons <= parseInt(filters.personsMax));
    }

    if (filters.priceMin) {
      filtered = filtered.filter((offer) => offer.totalPrice >= parseInt(filters.priceMin));
    }

    if (filters.priceMax) {
      filtered = filtered.filter((offer) => offer.totalPrice <= parseInt(filters.priceMax));
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((offer) => offer.startDate >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filtered = filtered.filter((offer) => offer.endDate <= filters.dateTo);
    }

    return filtered;
  }, [offers, searchTerm, filters]);

  const updateFilteredOffersEffect = useMemo(() => {
    updateFilteredOffers(filteredOffers);
    return filteredOffers;
  }, [filteredOffers, updateFilteredOffers]);

  const handleFilterChange = (key: keyof FinanceFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      client: "",
      createdBy: "",
      status: "",
      paymentStatus: "",
      personsMin: "",
      personsMax: "",
      priceMin: "",
      priceMax: "",
      dateFrom: "",
      dateTo: "",
    });
    setSearchTerm("");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return {
    searchTerm,
    setSearchTerm,
    showFilters,
    filters,
    filteredOffers: updateFilteredOffersEffect,
    filterOptions,
    handleFilterChange,
    clearFilters,
    toggleFilters,
  };
}
