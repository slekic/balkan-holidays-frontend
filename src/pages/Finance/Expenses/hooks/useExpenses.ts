import { useState, useEffect } from "react";
import { Expense } from "../utils/types";
import { fetchExpenses } from "../data/mockData";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const updateFilteredExpenses = (newFilteredExpenses: Expense[]) => {
    setFilteredExpenses(newFilteredExpenses);
  };

  useEffect(() => {
    const loadExpenses = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchExpenses(1, 10); 
        setExpenses(data);
        setFilteredExpenses(data);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
        setError("Failed to fetch expenses");
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, []);

  return {
    expenses,
    filteredExpenses,
    updateFilteredExpenses,
    loading,
    error,
  };
};
