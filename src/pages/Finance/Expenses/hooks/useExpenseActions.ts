import { useCallback } from "react";

export const useExpenseActions = () => {
  const handleViewFile = useCallback((fileName: string) => {
    console.log(`Viewing file: ${fileName}`);
    // In a real app, this would open a file viewer or download the file
  }, []);

  const handleExportToExcel = useCallback(() => {
    console.log("Exporting expenses to Excel");
    // In a real app, this would trigger an Excel export
  }, []);

  const handleEditExpense = useCallback((expenseId: string) => {
    console.log(`Editing expense: ${expenseId}`);
    // In a real app, this would open an edit modal or navigate to edit page
  }, []);

  const handleDeleteExpense = useCallback((expenseId: string) => {
    console.log(`Deleting expense: ${expenseId}`);
    // In a real app, this would show a confirmation dialog and delete the expense
  }, []);

  return {
    handleViewFile,
    handleExportToExcel,
    handleEditExpense,
    handleDeleteExpense,
  };
};

