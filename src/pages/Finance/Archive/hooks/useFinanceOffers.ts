import { useState, useMemo, useCallback, useEffect } from "react";
import { fetchFinanceOffers, FinanceOffer } from "../utils";

export function useFinanceOffers() {
  const [offers, setOffers] = useState<FinanceOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<FinanceOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOffers() {
      setLoading(true);
      try {
        const data = await fetchFinanceOffers();
        setOffers(data);
        setFilteredOffers(data);
      } catch (err) {
        console.error("Failed to fetch finance offers:", err);
        setError("Failed to load offers");
      } finally {
        setLoading(false);
      }
    }

    loadOffers();
  }, []);

  const totalOffers = offers.length;
  const totalFilteredOffers = filteredOffers.length;

  const totalValue = useMemo(() => offers.reduce((sum, o) => sum + o.totalPrice, 0), [offers]);
  const totalPaid = useMemo(() => offers.reduce((sum, o) => sum + o.totalPaid, 0), [offers]);
  const totalOutstanding = useMemo(() => totalValue - totalPaid, [totalValue, totalPaid]);

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
    loading,
    error,
  };
}
