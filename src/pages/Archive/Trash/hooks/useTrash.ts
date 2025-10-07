import { useState, useEffect } from "react";
import { DeletedOffer, TrashFilters } from "../types";
import { deletePermOfferApi, restoreOfferApi, getAllOffers } from "../../../../api/offer";
import { toast } from "react-toastify";
import { mapPonudaToOffer } from "../../../../utils/offer_response_mappers";

const itemsPerPage = 6;
const pagesPerBatch = 5;
const batchSize = itemsPerPage * pagesPerBatch;

export const useTrash = () => {
  const [currentBatch, setCurrentBatch] = useState<DeletedOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<DeletedOffer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBatchNumber, setCurrentBatchNumber] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
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

  // ----------------- FETCH -----------------
  const fetchBatch = async (batchNumber: number, filters: TrashFilters, searchTerm: string) => {
    const appliedFilters = {
        search: searchTerm,
        client: filters.client,
        status: filters.status,
        createdBy: filters.createdBy,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
      };
    try {
      const data = await getAllOffers(batchNumber, batchSize, true, -1, appliedFilters);
      const mapped = data.items.map(mapPonudaToOffer);
      setCurrentBatch(mapped);
      setFilteredOffers(mapped);
      setTotalItems(data.total);
    } catch (error) {
      console.error("Failed to fetch deleted offers:", error);
      toast.error("Neuspešno učitavanje smeća");
    }
  };

  useEffect(() => {
    fetchBatch(1, filters, searchTerm);
    setCurrentBatchNumber(1);
    setCurrentPage(1);
  }, []);

  // ----------------- PAGINACIJA -----------------
  const localPage = currentPage % pagesPerBatch === 0 ? pagesPerBatch : currentPage % pagesPerBatch;
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

  // ----------------- AKCIJE -----------------
  const updateBatchAndTotals = (newBatch: DeletedOffer[], total?: number) => {
    setCurrentBatch(newBatch);
    setFilteredOffers(newBatch);
    if (total !== undefined) setTotalItems(total);
  };

  const handleRestore = async (offerId: string) => {
    try {
      await restoreOfferApi(offerId);
      const newBatch = currentBatch.filter((o) => o.id !== offerId);
      updateBatchAndTotals(newBatch, totalItems - 1);

      if (newBatch.length === 0 && currentPage > 1) handlePageChange(currentPage - 1);

      toast.success("Ponuda je uspešno vraćena.");
    } catch (error) {
      console.error("Failed to restore offer:", error);
      toast.error("Vraćanje ponude nije uspelo.");
    }
  };

  const handlePermanentDelete = async (offerId: string) => {
    if (!confirm("Da li ste sigurni da trajno želite da obrišete ponudu?")) return;

    try {
      await deletePermOfferApi(offerId);
      const newBatch = currentBatch.filter((o) => o.id !== offerId);
      updateBatchAndTotals(newBatch, totalItems - 1);

      if (newBatch.length === 0 && currentPage > 1) handlePageChange(currentPage - 1);

      toast.success("Ponuda je uspešno obrisana.");
    } catch (error) {
      console.error("Failed to delete offer:", error);
      toast.error("Brisanje ponude nije uspelo.");
    }
  };

  // ----------------- SEARCH & FILTER -----------------
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters: Partial<TrashFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = async (newFilters: Partial<TrashFilters>, searchTerm: string) => {
      await fetchBatch(1, {...filters, ...newFilters}, searchTerm);
      setCurrentBatchNumber(1);
      setCurrentPage(1);
  };


  const handleToggleFilters = () => setShowFilters(!showFilters);

  const handleResetFilters = async () => {
    const emptyFilters: TrashFilters = {
      client: "",
      createdBy: "",
      deletedBy: "",
      status: "",
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

  const handleExport = () => {
    console.log("Exporting deleted offers");
  };

  return {
    startIndex,
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
    handleRestore,
    handlePermanentDelete,
    handleExport,
    handleSearchChange,
    handleFilterChange,
    handleToggleFilters,
    handleResetFilters,
    handleApplyFilters
  };
};
