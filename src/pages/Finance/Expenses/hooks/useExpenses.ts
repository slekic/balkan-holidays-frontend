import { useState, useEffect } from "react";
import { mockExpenses } from "../data/mockData";
import { Expense } from "../utils/types";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>(mockExpenses);

  const updateFilteredExpenses = (newFilteredExpenses: Expense[]) => {
    setFilteredExpenses(newFilteredExpenses);
  };

  // In a real app, this would fetch from an API
  useEffect(() => {
    // Simulate API call
    setExpenses(mockExpenses);
    setFilteredExpenses(mockExpenses);
  }, []);

  return {
    expenses,
    filteredExpenses,
    updateFilteredExpenses,
  };
};
