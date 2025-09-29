import { useCallback } from "react";
import { Expense } from "../utils/types";
import { exportSelectedExpenses } from "../../../../api/export";

export const useExpenseActions = (filteredExpenses: Expense[]) => {
  const handleViewFile = useCallback((fileName: string) => {
    if (!fileName) return;
    window.open(fileName, "_blank");
    console.log(`Viewing file: ${fileName}`);
  }, []);

  const handleExportToExcel = useCallback(() => {
    if (!filteredExpenses || filteredExpenses.length === 0) return;
    const ids = filteredExpenses.map((e) => Number(e.id));
    console.log("Exporting expenses to Excel", ids);
    exportSelectedExpenses(ids);
  }, [filteredExpenses]);

  const handleEditExpense = useCallback((expenseId: string) => {
    console.log(`Editing expense: ${expenseId}`);
  }, []);

  const handleDeleteExpense = useCallback((expenseId: string) => {
    console.log(`Deleting expense: ${expenseId}`);
  }, []);

  return {
    handleViewFile,
    handleExportToExcel,
    handleEditExpense,
    handleDeleteExpense,
  };
};
