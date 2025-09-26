import { useState, useEffect, useMemo } from "react";
import { DeletedOffer, TrashFilters } from "../types";
import { fetchOffers } from "../data/mockData";
import { deletePermOfferApi, restoreOfferApi } from "../../../../api/offer";
import { toast } from "react-toastify";

export const useTrash = () => {
  const [offers, setOffers] = useState<DeletedOffer[]>([]);
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

  // Fetch deleted offers on mount
  useEffect(() => {
    const loadDeletedOffers = async () => {
      try {
        const data = await fetchOffers(); 
        setOffers(data);
      } catch (error) {
        console.error("Failed to fetch deleted offers:", error);
      }
    };

    loadDeletedOffers();
  }, []);

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

      return (
        matchesSearch &&
        matchesClient &&
        matchesStatus &&
        matchesCreatedBy &&
        matchesDeletedBy
      );
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

  const handleRestore = async (offerId: string) => {
      try {
        await restoreOfferApi(offerId);

        setOffers((prev) => prev?.filter((offer) => offer.id !== offerId));

        toast.success("Ponuda je uspešno vraćena.");
      } catch (error) {
        console.error("Failed to restore offer:", error);
        toast.error("Vraćanje ponude nije uspelo.");
      }
  };


  const handlePermanentDelete = async (offerId: string) => {
    if (
      confirm(
        "Da li ste sigurni da trajno želite da obrišete ponudu?"
      )
    ) {
      try {
        await deletePermOfferApi(offerId);

        setOffers((prev) => prev?.filter((offer) => offer.id !== offerId));

        toast.success("Ponuda je uspešno obrisana.");
      } catch (error) {
        console.error("Failed to restore offer:", error);
        toast.error("Brisanje ponude nije uspelo.");
      }
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
