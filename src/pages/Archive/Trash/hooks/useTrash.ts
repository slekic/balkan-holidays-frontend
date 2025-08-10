import { useState, useMemo } from "react";
import { DeletedOffer, TrashFilters } from "../types";
import { mockDeletedOffers } from "../data/mockData";

export const useTrash = () => {
  const [offers] = useState<DeletedOffer[]>(mockDeletedOffers);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<TrashFilters>({
    client: "",
    createdBy: "",
    deletedBy: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  const itemsPerPage = 6;

  // Filter offers based on search term and filters
  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const matchesSearch =
        searchTerm === "" ||
        offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.client.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClient = filters.client === "" || offer.client === filters.client;
      const matchesStatus = filters.status === "" || offer.status === filters.status;
      const matchesCreatedBy = filters.createdBy === "" || offer.createdBy === filters.createdBy;
      const matchesDeletedBy = filters.deletedBy === "" || offer.deletedBy === filters.deletedBy;

      return matchesSearch && matchesClient && matchesStatus && matchesCreatedBy && matchesDeletedBy;
    });
  }, [offers, searchTerm, filters]);

  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOffers = filteredOffers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<TrashFilters>) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleRestore = (offerId: string) => {
    if (
      confirm(
        "Are you sure you want to restore this offer? It will be moved back to All Offers."
      )
    ) {
      console.log(`Restoring offer ${offerId}`);
    }
  };

  const handlePermanentDelete = (offerId: string) => {
    if (
      confirm(
        "Are you sure you want to permanently delete this offer? This action cannot be undone."
      )
    ) {
      console.log(`Permanently deleting offer ${offerId}`);
    }
  };

  const handleExport = () => {
    console.log("Exporting deleted offers to Excel");
  };

  return {
    currentOffers,
    filteredOffers,
    showFilters,
    searchTerm,
    filters,
    totalPages,
    currentPage,
    startIndex,
    itemsPerPage,
    handleRestore,
    handlePermanentDelete,
    handleExport,
    handlePageChange,
    handleSearchChange,
    handleFilterChange,
    handleToggleFilters,
  };
};

