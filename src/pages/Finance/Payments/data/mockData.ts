import { getAllFinanceOffersWithPayments } from '../../../../api/finances';
import { mapPonudaFinanceWithPaymentsToOffer } from '../../../../utils/finance_response_mappers';
import { PaymentOffer } from '../utils/types';

export async function fetchFinanceOffersWithPayments(): Promise<
  PaymentOffer[]> {
  try {
    const data = await getAllFinanceOffersWithPayments();
    return data.items.map(mapPonudaFinanceWithPaymentsToOffer);
  } catch (err) {
    console.error("Failed to fetch finance offers with payments:", err);
    return [];
  }
}