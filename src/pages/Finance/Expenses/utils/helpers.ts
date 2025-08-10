import { Expense, ExpenseFilters, ExpenseSummary } from "./types";

export const calculateExpenseSummary = (expenses: Expense[]): ExpenseSummary => {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalCount = expenses.length;
  const averageAmount = totalCount > 0 ? Math.round(totalAmount / totalCount) : 0;

  return {
    totalAmount,
    totalCount,
    averageAmount,
  };
};

export const filterExpenses = (
  expenses: Expense[],
  filters: ExpenseFilters,
  searchTerm: string
): Expense[] => {
  return expenses.filter((expense) => {
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        expense.offerCode.toLowerCase().includes(searchLower) ||
        expense.offerName.toLowerCase().includes(searchLower) ||
        expense.entityName.toLowerCase().includes(searchLower) ||
        expense.client.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Entity type filter
    if (filters.entityType && expense.entityType !== filters.entityType) {
      return false;
    }

    // Entity name filter
    if (filters.entityName && !expense.entityName.toLowerCase().includes(filters.entityName.toLowerCase())) {
      return false;
    }

    // Client filter
    if (filters.client && expense.client !== filters.client) {
      return false;
    }

    // Created by filter
    if (filters.createdBy && expense.createdBy !== filters.createdBy) {
      return false;
    }

    // Date range filters
    if (filters.dateFrom && new Date(expense.travelDate) < new Date(filters.dateFrom)) {
      return false;
    }

    if (filters.dateTo && new Date(expense.travelDate) > new Date(filters.dateTo)) {
      return false;
    }

    return true;
  });
};

export const paginateExpenses = (
  expenses: Expense[],
  currentPage: number,
  itemsPerPage: number
): { currentExpenses: Expense[]; totalPages: number; startIndex: number } => {
  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExpenses = expenses.slice(startIndex, startIndex + itemsPerPage);

  return {
    currentExpenses,
    totalPages,
    startIndex,
  };
};
