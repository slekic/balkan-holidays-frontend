import { toast } from "react-toastify";
import { exportOfferInvoice, exportOfferProforma, exportSelectedFinOffers } from "../../../../api/export";
import { ActionType, FinanceOffer } from "../utils/types";

export function useFinanceActions(filteredOffers: FinanceOffer[]) {
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
      case "proforma":
        try {
              await exportOfferProforma(Number(offerId));
        } catch (error) {
              toast.error("Neuspešno eksportovanje predračuna");
        }
        break;
      case "advance":
        try {
              await exportOfferInvoice(Number(offerId), true);
        } catch (error) {
              toast.error("Neuspešno eksportovanje avansne fakture");
        }
        break;
      case "final":
        try {
              await exportOfferInvoice(Number(offerId), false);
        } catch (error) {
              toast.error("Neuspešno eksportovanje fakture");
        }
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  };

  const handleExportToExcel = async () => {
      if (!filteredOffers || filteredOffers.length === 0) {
        console.warn("Nema ponuda za export");
        return;
      }
  
      const offersIds = filteredOffers.map((offer) => Number(offer.id));
      console.log("EXPORTIRAM " + offersIds)
      try {
        await exportSelectedFinOffers(offersIds);
      } catch (err) {
        console.log("Greška prilikom exporta ponuda:", err)
        toast.error("Greška prilikom exporta ponuda");
      }
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
