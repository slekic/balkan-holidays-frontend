import { useState } from "react";
import { FollowUpOffer, FollowUpOfferFilters } from "../types";
import { mockFollowUpOffers } from "../data/mockData";

export const useFollowUpOffers = () => {
  const [offers] = useState<FollowUpOffer[]>(mockFollowUpOffers);
  const [filteredOffers, setFilteredOffers] = useState<FollowUpOffer[]>(mockFollowUpOffers);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FollowUpOfferFilters>({
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent":
        return "bg-blue-100 text-blue-800";
      case "Accepted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Finished":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFollowUpUrgency = (days: number) => {
    if (days <= 3) return "bg-red-100 text-red-800";
    if (days <= 7) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  const handleStatusChange = (offerId: string, newStatus: string) => {
    console.log(`Changing offer ${offerId} status to ${newStatus}`);
  };

  const handleAction = (action: string, offerId: string) => {
    console.log(`${action} action for offer ${offerId}`);
  };

  const handleExport = () => {
    console.log("Exporting follow-up offers to Excel");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: FollowUpOfferFilters) => {
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
    getStatusColor,
    getFollowUpUrgency,
    handleStatusChange,
    handleAction,
    handleExport,
    handlePageChange,
    handleSearchChange,
    handleFilterChange,
    handleToggleFilters,
  };
};
