import { useState, useMemo, useCallback } from "react";
import { DebtOffer } from "../utils/types";
import { mockDebtOffers } from "../utils/constants";

export function useDebtOffers() {
  const [offers] = useState<DebtOffer[]>(mockDebtOffers);
  const [filteredOffers, setFilteredOffers] = useState<DebtOffer[]>(mockDebtOffers);

  const totalOffers = offers.length;
  const totalFilteredOffers = filteredOffers.length;

  const updateFilteredOffers = useCallback((newFilteredOffers: DebtOffer[]) => {
    setFilteredOffers(newFilteredOffers);
  }, []);

  return {
    offers,
    filteredOffers,
    totalOffers,
    totalFilteredOffers,
    updateFilteredOffers,
  };
}

