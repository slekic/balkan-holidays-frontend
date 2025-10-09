import { useState, useEffect, useCallback, useMemo } from "react";
import { Expense, ExpenseFilters, ExpenseSummary } from "../utils/types";
import { getAllExpenses } from "../../../../api/finances";
import { mapPonudaNaExpense } from "../../../../utils/finance_response_mappers";

const ITEMS_PER_PAGE = 8;
const PAGES_PER_BATCH = 5;
const BATCH_SIZE = ITEMS_PER_PAGE * PAGES_PER_BATCH;

export const useExpenses = () => {
  const [currentBatch, setCurrentBatch] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentBatchNumber, setCurrentBatchNumber] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [summary, setSummary] = useState<ExpenseSummary>({
    averageAmount: 0,
    totalAmount: 0,
    totalCount: 0
  })
  const [filters, setFilters] = useState<ExpenseFilters>({
      entityType: "",
      entityName: "",
      client: "",
      createdBy: "",
      dateFrom: "",
      dateTo: "",
    });

  // ---------------- FETCH BATCH ----------------
  const fetchBatch = async (batchNumber: number,
          filters: ExpenseFilters,
          searchTerm: string
  ) => {
    setLoading(true);
    const appliedFilters = {
      search: searchTerm,
      client: filters.client,
      entityType: filters.entityType,
      entityName: filters.entityName,   
    };
    try {
      const data = await getAllExpenses(batchNumber, BATCH_SIZE, appliedFilters);
      const mapped = data.items.map(mapPonudaNaExpense);
      setCurrentBatch(mapped);
      setFilteredExpenses(mapped);
      setTotalItems(data.total);
      setSummary(data.summary)
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      setError("Greška pri učitavanju troškova");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatch(1, filters, searchTerm);
  }, []);

  // ---------------- PAGINATION ----------------
  const currentBatchStartIndex = (currentPage - 1) % PAGES_PER_BATCH * ITEMS_PER_PAGE;
  const currentExpenses = filteredExpenses.slice(
    currentBatchStartIndex,
    currentBatchStartIndex + ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handlePageChange = async (page: number) => {
    // Check if we need to fetch a new batch
    const newBatchNumber = Math.ceil(page / PAGES_PER_BATCH);
    if (newBatchNumber !== currentBatchNumber) {
      await fetchBatch(newBatchNumber, filters, searchTerm);
      setCurrentBatchNumber(newBatchNumber);
    }
    setCurrentPage(page);
  };

  // ---------------- FILTERING ----------------
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
  const handleFilterChange = (newFilters: ExpenseFilters) => {
    setFilters(newFilters);
  };
    
  const handleResetFilters = async () => {
    const emptyFilters: ExpenseFilters = {
        entityName: "",
        entityType: "",
        createdBy: "",
        client: "",
        dateFrom: "",
        dateTo: ""
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
  
  const handleApplyFilters = async (filters: ExpenseFilters, searchTerm: string) => {
    await fetchBatch(1, filters, searchTerm);
    setCurrentBatchNumber(1);
    setCurrentPage(1);
  };
    
  return {
    currentBatch,
    currentExpenses,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage: ITEMS_PER_PAGE,
    pagesPerBatch: PAGES_PER_BATCH,
    currentBatchNumber,
    handlePageChange,
    handleSearchChange,
    handleFilterChange,
    handleToggleFilters,
    handleApplyFilters,
    handleResetFilters,
    showFilters,
    searchTerm,
    filters,
    summary
  };
};
