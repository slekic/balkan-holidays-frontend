import { useMemo } from "react";
import { OfferFormData } from "../../../types/offer";

export function useTotals(
  formData: OfferFormData,
  accommodationTotal: number,
  landServicesTotal: number
) {
  const totalOfferCost = useMemo(() => {
    let total = 0;
    if (formData.accommodationEnabled) total += accommodationTotal;
    if (formData.landServicesEnabled) total += landServicesTotal;
    return total;
  }, [formData.accommodationEnabled, formData.landServicesEnabled, accommodationTotal, landServicesTotal]);

  const pricePerPerson = useMemo(() => {
    return formData.numberOfPersons > 0 ? totalOfferCost / formData.numberOfPersons : 0;
  }, [totalOfferCost, formData.numberOfPersons]);

  return { totalOfferCost, pricePerPerson };
}


