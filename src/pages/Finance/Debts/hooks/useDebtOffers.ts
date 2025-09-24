import { useState, useEffect, useCallback, useMemo } from "react";
import { DebtOffer } from "../utils/types";
import { fetchFinanceOffersWithPayments } from "../utils";

export function useDebtOffers() {
  const [offers, setOffers] = useState<DebtOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<DebtOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOffers() {
      setLoading(true);
      try {
        const data = await fetchFinanceOffersWithPayments();
        setOffers(data);
        setFilteredOffers(data);
      } catch (err) {
        console.error("Failed to fetch debt offers:", err);
        setError("Failed to load debt offers");
      } finally {
        setLoading(false);
      }
    }

    loadOffers();
  }, []);

  const totalOffers = offers.length;
  const totalFilteredOffers = filteredOffers.length;

  const totalValue = useMemo(
    () => offers.reduce((sum, o) => sum + o.totalPrice, 0),
    [offers]
  );
  const totalPaid = useMemo(
    () => offers.reduce((sum, o) => sum + o.totalPaid, 0),
    [offers]
  );
  const totalOutstanding = useMemo(
    () => totalValue - totalPaid,
    [totalValue, totalPaid]
  );

  const updateFilteredOffers = useCallback((newFilteredOffers: DebtOffer[]) => {
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
    loading,
    error,
  };
}
