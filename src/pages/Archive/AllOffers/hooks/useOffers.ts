import { useState, useMemo } from "react";
import { Offer, OfferFilters } from "../types";
import { mockOffers } from "../data/mockData";

export const useOffers = () => {
  const [offers] = useState<Offer[]>(mockOffers);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>(mockOffers);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<OfferFilters>({
    client: "",
    entity: "",
    createdBy: "",
    status: "",
    personsMin: "",
    personsMax: "",
    priceMin: "",
    priceMax: "",
    dateFrom: "",
    dateTo: "",
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOffers = filteredOffers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleStatusChange = (offerId: string, newStatus: string) => {
    console.log(`Changing offer ${offerId} status to ${newStatus}`);
  };

  const handleAction = (action: string, offerId: string) => {
    console.log(`${action} action for offer ${offerId}`);
  };

  const handleExport = () => {
    console.log("Exporting offers to Excel");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: OfferFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return {
    offers,
    filteredOffers,
    currentOffers,
    currentPage,
    showFilters,
    searchTerm,
    filters,
    totalPages,
    itemsPerPage,
    startIndex,
    handleStatusChange,
    handleAction,
    handleExport,
    handlePageChange,
    handleSearchChange,
    handleFilterChange,
    handleToggleFilters,
  };
};
