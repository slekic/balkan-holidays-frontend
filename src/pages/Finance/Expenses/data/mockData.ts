import { getAllExpenses } from "../../../../api/finances";
import { mapPonudaNaExpense } from "../../../../utils/finance_response_mappers";
import { Expense } from "../utils/types";

export async function fetchExpenses(page: number = 1, limit: number = 100): Promise<Expense[]> {
  try {
    const data = await getAllExpenses(page, limit);
    return data.items.map(mapPonudaNaExpense);
  } catch (err) {
    console.error("Failed to fetch expenses:", err);
    return [];
  }
}