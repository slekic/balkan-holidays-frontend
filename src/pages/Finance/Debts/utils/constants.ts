import { getAllFinanceOffersWithPayments } from "../../../../api/finances";
import { mapPonudaFinanceWithPaymentsToDebtOffer } from "../../../../utils/finance_response_mappers";
import { DebtOffer } from "./types";

export async function fetchFinanceOffersWithPayments(): Promise<
  DebtOffer[]> {
  try {
    const data = await getAllFinanceOffersWithPayments(1, 100, false, true); 
    return data.items.map(mapPonudaFinanceWithPaymentsToDebtOffer);
  } catch (err) {
    console.error("Failed to fetch finance offers with payments:", err);
    return [];
  }
}

export const filterOptions = [
  { label: "All", value: "all" },
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];

export const ITEMS_PER_PAGE = 8;


