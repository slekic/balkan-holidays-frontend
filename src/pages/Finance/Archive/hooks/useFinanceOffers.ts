import { useState, useMemo, useCallback } from "react";
import { FinanceOffer } from "../utils/types";
import { mockFinanceOffers } from "../utils/constants";

export function useFinanceOffers() {
  const [offers] = useState<FinanceOffer[]>(mockFinanceOffers);
  const [filteredOffers, setFilteredOffers] = useState<FinanceOffer[]>(mockFinanceOffers);

  const totalOffers = offers.length;
  const totalFilteredOffers = filteredOffers.length;

  const totalValue = useMemo(() => {
    return offers.reduce((sum, offer) => sum + offer.totalPrice, 0);
  }, [offers]);

  const totalPaid = useMemo(() => {
    return offers.reduce((sum, offer) => sum + offer.totalPaid, 0);
  }, [offers]);

  const totalOutstanding = useMemo(() => {
    return totalValue - totalPaid;
  }, [totalValue, totalPaid]);

  const updateFilteredOffers = useCallback((newFilteredOffers: FinanceOffer[]) => {
    setFilteredOffers(newFilteredOffers);
  }, []);

  return {
    offers,
    filteredOffers,
    totalOffers,
    totalFilteredOffers,
    totalValue,
    totalPaid,
    totalOutstanding,
    updateFilteredOffers,
  };
}
