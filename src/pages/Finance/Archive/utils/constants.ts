import { getAllFinanceOffers } from "../../../../api/finances";
import { mapPonudaFinanceToOffer } from "../../../../utils/finance_response_mappers";
import { FinanceOffer } from "./types";

export async function fetchFinanceOffers(batchNumber: number, batchSize: number): Promise<FinanceOffer[]> {
  try {
    const data = await getAllFinanceOffers(batchNumber, batchSize, false);
    return data.items.map(mapPonudaFinanceToOffer);
  } catch (error) {
    console.error("Failed to fetch finance offers:", error);
    return [];
  }
}

export const filterOptions = {
  statuses: ["Accepted", "Finished"],
  paymentStatuses: ["Not Paid", "Partially Paid", "Fully Paid"],
};

export const ITEMS_PER_PAGE = 6;
