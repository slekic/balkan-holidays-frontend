import { useState, useCallback } from "react";
import { Expense, ExpenseFilters } from "../utils/types";
import { filterExpenses } from "../utils/helpers";

export const useExpenseFilters = (
  expenses: Expense[],
  updateFilteredExpenses: (expenses: Expense[]) => void
) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ExpenseFilters>({
    entityType: "",
    entityName: "",
    client: "",
    createdBy: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleFilterChange = useCallback(
    (key: keyof ExpenseFilters, value: string) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      
      // Apply filters immediately
      const filtered = filterExpenses(expenses, newFilters, searchTerm);
      updateFilteredExpenses(filtered);
    },
    [filters, expenses, searchTerm, updateFilteredExpenses]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      
      // Apply search immediately
      const filtered = filterExpenses(expenses, filters, value);
      updateFilteredExpenses(filtered);
    },
    [expenses, filters, updateFilteredExpenses]
  );

  const clearFilters = useCallback(() => {
    const clearedFilters: ExpenseFilters = {
      entityType: "",
      entityName: "",
      client: "",
      createdBy: "",
      dateFrom: "",
      dateTo: "",
    };
    
    setFilters(clearedFilters);
    setSearchTerm("");
    
    // Reset to all expenses
    updateFilteredExpenses(expenses);
  }, [expenses, updateFilteredExpenses]);

  const toggleFilters = useCallback(() => {
    setShowFilters(!showFilters);
  }, [showFilters]);

  return {
    searchTerm,
    setSearchTerm: handleSearchChange,
    showFilters,
    filters,
    handleFilterChange,
    clearFilters,
    toggleFilters,
  };
};
