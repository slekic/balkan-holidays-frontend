import { useState, useEffect } from "react";
import { FollowUpOffer, FollowUpOfferFilters } from "../types";
import { getAllOffers, updateOfferStatusAPI } from "../../../../api/offer";
import { mapPonudaToOffer } from "../../../../utils/offer_response_mappers";
import { toast } from "react-toastify";

const itemsPerPage = 6;
const pagesPerBatch = 5;
const batchSize = itemsPerPage * pagesPerBatch;

export const useFollowUpOffers = () => {
  const [currentBatch, setCurrentBatch] = useState<FollowUpOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<FollowUpOffer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBatchNumber, setCurrentBatchNumber] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
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

  // ----------------- FETCH -----------------
  const fetchBatch = async (
    batchNumber: number,
    filters: FollowUpOfferFilters,
    searchTerm: string
  ) => {
    const appliedFilters = {
      search: searchTerm,
      client: filters.client,
      entity: filters.entity,
      status: filters.status,
      createdBy: filters.createdBy,
      personsMin: Number(filters.personsMin),
      personsMax: Number(filters.personsMax),
      priceMin: Number(filters.priceMin),
      priceMax: Number(filters.priceMax),
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    };

    try {
      const data = await getAllOffers(batchNumber, batchSize, false, 2, appliedFilters);
      const mapped = data.items.map(mapPonudaToOffer);
      setCurrentBatch(mapped);
      setFilteredOffers(mapped);
      setTotalItems(data.total);
    } catch (error) {
      console.error("Failed to fetch follow-up offers:", error);
      toast.error("Neuspešno učitavanje ponuda");
    }
  };

  // Inicijalno učitavanje
  useEffect(() => {
    fetchBatch(1, filters, searchTerm);
    setCurrentBatchNumber(1);
    setCurrentPage(1);
  }, []);

  // ----------------- PAGINACIJA -----------------
  const localPage =
    currentPage % pagesPerBatch === 0 ? pagesPerBatch : currentPage % pagesPerBatch;
  const startIndex = (localPage - 1) * itemsPerPage;
  const currentOffers = filteredOffers.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = async (page: number) => {
    const newBatch = page % pagesPerBatch;
    if (newBatch === 1 || newBatch === 0) {
      const newBatchNumber = Math.ceil(page / pagesPerBatch);
      await fetchBatch(newBatchNumber, filters, searchTerm);
      setCurrentBatchNumber(newBatchNumber);
    }
    setCurrentPage(page);
  };

  // ----------------- STATUS -----------------
  const handleStatusChange = async (offerId: string, newStatus: string) => {
    const result = await updateOfferStatusAPI({ offerId, newStatus });
    if (result.success) {
      setCurrentBatch((prev) =>
        prev.map((o) =>
          o.id === offerId ? { ...o, status: newStatus as FollowUpOffer["status"] } : o
        )
      );
      setFilteredOffers((prev) =>
        prev.map((o) =>
          o.id === offerId ? { ...o, status: newStatus as FollowUpOffer["status"] } : o
        )
      );
    } else {
      console.error("Failed to update status:", result.message);
      toast.error("Neuspešna promena statusa");
    }
  };

  // ----------------- SEARCH & FILTERI -----------------
  const handleSearchChange = (value: string) => setSearchTerm(value);
  const handleFilterChange = (newFilters: FollowUpOfferFilters) => setFilters(newFilters);

  const handleResetFilters = async () => {
    const emptyFilters: FollowUpOfferFilters = {
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
    };
    setFilters(emptyFilters);
    setSearchTerm("");
    setShowFilters(false);
    await fetchBatch(1, emptyFilters, "");
    setCurrentBatchNumber(1);
    setCurrentPage(1);
  };

  const handleToggleFilters = () => setShowFilters(!showFilters);

  const handleApplyFilters = async (filters: FollowUpOfferFilters, searchTerm: string) => {
    await fetchBatch(1, filters, searchTerm);
    setCurrentBatchNumber(1);
    setCurrentPage(1);
  };

  // ----------------- OSTALO -----------------
  const handleAction = (action: string, offerId: string) => {
    console.log(`${action} action for offer ${offerId}`);
  };

  const handleExport = () => {
    console.log("Exporting follow-up offers");
  };

  return {
    currentOffers,
    currentPage,
    currentBatchNumber,
    totalPages,
    itemsPerPage,
    totalItems,
    pagesPerBatch,
    showFilters,
    searchTerm,
    filters,
    currentBatch,
    filteredOffers,
    handlePageChange,
    handleStatusChange,
    handleAction,
    handleExport,
    handleSearchChange,
    handleFilterChange,
    handleToggleFilters,
    handleApplyFilters,
    handleResetFilters,
  };
};
