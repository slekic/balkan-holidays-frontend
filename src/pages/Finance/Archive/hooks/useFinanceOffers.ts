import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { FinanceFilters, FinanceOffer } from "../utils/types";
import { getAllFinanceOffers } from "../../../../api/finances";
import { mapPonudaFinanceToOffer } from "../../../../utils/finance_response_mappers";

const ITEMS_PER_PAGE = 6;
const PAGES_PER_BATCH = 5;
const BATCH_SIZE = ITEMS_PER_PAGE * PAGES_PER_BATCH;

export function useFinanceOffers() {
  const [currentBatch, setCurrentBatch] = useState<FinanceOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<FinanceOffer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBatchNumber, setCurrentBatchNumber] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FinanceFilters>({
    client: "",
    createdBy: "",
    paymentStatus: "",
    status: "",
    personsMin: "",
    personsMax: "",
    priceMin: "",
    priceMax: "",
    dateFrom: "",
    dateTo: "",
  });
  // ---------------- FETCH BATCH ----------------
  const fetchBatch = async (batchNumber: number, 
      filters: FinanceFilters,
      searchTerm: string) => {
    setLoading(true);

    const appliedFilters = {
      search: searchTerm,
      client: filters.client,
      status: filters.status,
      paymentStatus: filters.paymentStatus,
      createdBy: filters.createdBy,
      personsMin: Number(filters.personsMin),
      personsMax: Number(filters.personsMax),
      priceMin: Number(filters.priceMin),
      priceMax: Number(filters.priceMax),
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    };

    try {
      console.log("GET SA ", batchNumber)
      console.log("GET sa ", BATCH_SIZE)
      const data = await getAllFinanceOffers(batchNumber, BATCH_SIZE, appliedFilters);
      const mapped = data.items.map(mapPonudaFinanceToOffer);
      setCurrentBatch(mapped);
      setFilteredOffers(mapped);
      setTotalItems(data.total);
    } catch (err) {
      console.error("Failed to fetch finance offers:", err);
      setError("Greška pri učitavanju finansijskih ponuda");
      toast.error("Greška pri učitavanju finansijskih ponuda");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatch(1, filters, searchTerm);
  }, []);

  // ---------------- PAGINATION ----------------
  const localPage =
    currentPage % PAGES_PER_BATCH === 0
      ? PAGES_PER_BATCH
      : currentPage % PAGES_PER_BATCH;

  const startIndex = (localPage - 1) * ITEMS_PER_PAGE;
  const currentOffers = filteredOffers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handlePageChange = async (page: number) => {
    const newBatchModulo = page % PAGES_PER_BATCH;
    if (newBatchModulo === 1 || newBatchModulo === 0) {
      const newBatchNumber = Math.ceil(page / PAGES_PER_BATCH);
      await fetchBatch(newBatchNumber, filters, searchTerm);
      setCurrentBatchNumber(newBatchNumber);
    }
    setCurrentPage(page);
  };

  // ---------------- TOTALS ----------------
  const totalValue = useMemo(
    () => filteredOffers.reduce((sum, o) => sum + o.totalPrice, 0),
    [filteredOffers]
  );
  const totalPaid = useMemo(
    () => filteredOffers.reduce((sum, o) => sum + o.totalPaid, 0),
    [filteredOffers]
  );
  const totalOutstanding = useMemo(
    () => totalValue - totalPaid,
    [totalValue, totalPaid]
  );

  // ---------------- FILTERING ----------------
    const handleSearchChange = (value: string) => {
      setSearchTerm(value);
    };

    const handleFilterChange = (newFilters: FinanceFilters) => {
      setFilters(newFilters);
    };
  
    const handleResetFilters = async () => {
      const emptyFilters: FinanceFilters = {
        client: "",
        paymentStatus: "",
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
  
    const handleToggleFilters = () => {
      setShowFilters(!showFilters);
    };

    const handleApplyFilters = async (filters: FinanceFilters, searchTerm: string) => {
      console.log("TRAZIMOOO ", searchTerm)
        await fetchBatch(1, filters, searchTerm);
        setCurrentBatchNumber(1);
        setCurrentPage(1);
    };
  

  // ---------------- BATCH & TOTALS UPDATE ----------------
  const updateBatchAndTotals = (newBatch: FinanceOffer[], total?: number) => {
    setCurrentBatch(newBatch);
    setFilteredOffers(newBatch);
    if (total !== undefined) setTotalItems(total);
  };

  return {
    currentOffers,
    currentPage,
    currentBatchNumber,
    totalPages,
    totalItems,
    itemsPerPage: ITEMS_PER_PAGE,
    pagesPerBatch: PAGES_PER_BATCH,
    totalValue,
    totalPaid,
    totalOutstanding,
    loading,
    error,
    handlePageChange,
    updateBatchAndTotals,
    filteredOffers,
    handleSearchChange,
    handleFilterChange,
    handleToggleFilters,
    handleApplyFilters,
    handleResetFilters,
    showFilters,
    searchTerm,
    filters,
  };
}
