import { useState } from "react";
import { OfferFormData } from "../../../types/offer";

export function useOfferState() {
  const [formData, setFormData] = useState<OfferFormData>({
    offerName: "",
    offerCode: "",
    clientId: "",
    location: "",
    numberOfPersons: 1,
    startDate: "",
    endDate: "",
    option: "",
    numberOfDays: 0,
    accommodationEnabled: true,
    hotels: [],
    landServicesEnabled: true,
    landServices: [],
    totalPrice: 0,
    pricePerPerson: 0,
  });

  const handleInputChange = (field: keyof OfferFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return { formData, setFormData, handleInputChange };
}


