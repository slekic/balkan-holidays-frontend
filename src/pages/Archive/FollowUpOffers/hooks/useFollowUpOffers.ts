import { useState, useEffect } from "react";
import { FollowUpOffer, FollowUpOfferFilters } from "../types";
import { fetchOffers } from "../data/mockData"; // ovo sada treba da poziva pravi API
import { updateOfferStatusAPI } from "../../../../api/offer";
import { Offer } from "../../AllOffers/types";

export const useFollowUpOffers = () => {
  const [offers, setOffers] = useState<FollowUpOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<FollowUpOffer[]>([]);
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

  // --- fetch real offers ---
  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await fetchOffers(); 
        setOffers(data);
        setFilteredOffers(data);
      } catch (error) {
        console.error("Failed to fetch offers:", error);
      }
    };

    loadOffers();
  }, []);

  // --- filter + search ---
  useEffect(() => {
    let filtered = [...offers];

    if (searchTerm.trim() !== "") {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (offer) =>
          offer.name.toLowerCase().includes(lower) ||
          offer.code.toLowerCase().includes(lower)
      );
    }

    // filters
    if (filters.client) {
      filtered = filtered.filter((offer) => offer.client === filters.client);
    }
    if (filters.status) {
      filtered = filtered.filter((offer) => offer.status === filters.status);
    }
    if (filters.createdBy) {
      filtered = filtered.filter((offer) => offer.createdBy === filters.createdBy);
    }
    if (filters.entity) {
      filtered = filtered.filter((offer) =>
        offer.entities.some((e) => e.toLowerCase().includes(filters.entity.toLowerCase()))
      );
    }
    if (filters.personsMin) {
      filtered = filtered.filter(
        (offer) => offer.numberOfPersons >= Number(filters.personsMin)
      );
    }
    if (filters.personsMax) {
      filtered = filtered.filter(
        (offer) => offer.numberOfPersons <= Number(filters.personsMax)
      );
    }
    if (filters.priceMin) {
      filtered = filtered.filter(
        (offer) => offer.totalPrice >= Number(filters.priceMin)
      );
    }
    if (filters.priceMax) {
      filtered = filtered.filter(
        (offer) => offer.totalPrice <= Number(filters.priceMax)
      );
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(
        (offer) => new Date(offer.startDate) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(
        (offer) => new Date(offer.endDate) <= new Date(filters.dateTo)
      );
    }

    setFilteredOffers(filtered);
    setCurrentPage(1);
  }, [offers, searchTerm, filters]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOffers = filteredOffers.slice(startIndex, startIndex + itemsPerPage);

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
    if (days <= 2) return "bg-red-100 text-red-800";
    if (days <= 7) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  const handleStatusChange = async (offerId: string, newStatus: string) => {
    const result = await updateOfferStatusAPI({ offerId, newStatus });
    if (result.success) {
      setOffers((prev) =>
        prev.map((o) =>
          o.id === offerId ? { ...o, status: newStatus as Offer["status"] } : o
        )
      );

      setFilteredOffers((prev) =>
        prev
          .map((o) =>
            o.id === offerId ? { ...o, status: newStatus as Offer["status"] } : o
          )
          .filter((o) => o.status === "Sent")
      );
    } else {
      console.error("Failed to update status:", result.message);
    }
  };

  const handleAction = (action: string, offerId: string) => {
    console.log(`${action} action for offer ${offerId}`);
  };

  const handleExport = () => {
    console.log("Exporting follow-up offers to Excel");
  };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };
  const handleFilterChange = (newFilters: FollowUpOfferFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };
  const handleToggleFilters = () => setShowFilters(!showFilters);

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
