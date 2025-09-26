import { toast } from "react-toastify";
import { exportOfferProforma } from "../../../../api/export";
import { ActionType } from "../utils/types";

export function useFinanceActions() {
  const handleAction = async (action: ActionType, offerId: string) => {
    console.log(`${action} action for offer ${offerId}`);
    
    // Here you would implement the actual action logic
    // For now, we'll just log the action
    switch (action) {
      case "view":
        // Navigate to offer details or open modal
        break;
      case "edit":
        // Navigate to edit form or open edit modal
        break;
      case "duplicate":
        // Create a copy of the offer
        break;
      case "proforma":
        try {
              await exportOfferProforma(Number(offerId));
        } catch (error) {
              toast.error("Neuspešno eksportovanje predračuna");
        }
        break;
      case "advance":
        // Generate advance invoice
        break;
      case "final":
        // Generate final invoice
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  };

  const handleExportToExcel = () => {
    console.log("Exporting to Excel...");
    // Implement Excel export logic
  };

  const handleDownloadInvoice = (invoiceType: string, offerId: string) => {
    console.log(`Downloading ${invoiceType} for offer ${offerId}`);
    // Implement invoice download logic
  };

  return {
    handleAction,
    handleExportToExcel,
    handleDownloadInvoice,
  };
}
