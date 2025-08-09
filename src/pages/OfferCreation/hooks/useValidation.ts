import { useEffect, useState } from "react";
import { OfferFormData } from "../../../types/offer";

export function useValidation(formData: OfferFormData) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const newErrors: Record<string, string> = {};
    if (!formData.offerName.trim()) newErrors.offerName = "Naziv ponude je obavezan";
    if (!formData.offerCode.trim()) newErrors.offerCode = "Šifra ponude je obavezna";
    if (!formData.clientId) newErrors.clientId = "Klijent mora biti izabran";
    if (!formData.location.trim()) newErrors.location = "Lokacija je obavezna";
    if (formData.numberOfPersons < 1) newErrors.numberOfPersons = "Broj osoba mora biti najmanje 1";
    if (!formData.startDate) newErrors.startDate = "Datum početka je obavezan";
    if (!formData.endDate) newErrors.endDate = "Datum završetka je obavezan";
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) newErrors.endDate = "Datum završetka mora biti posle datuma početka";
    }
    setErrors(newErrors);
  }, [formData]);

  return errors;
}


