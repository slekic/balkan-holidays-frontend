import { ServiceEntry } from "../../../types/offer";
import { useOfferState } from "./useOfferState";
import { useDatesAndDays } from "./useDatesAndDays";
import { useValidation } from "./useValidation";
import { useAccommodation } from "./useAccommodation";
import { useLandServices } from "./useLandServices";
import { useTotals } from "./useTotals";
import { generateId } from "../utils/id";

type CMSEntities = {
  hotels: any[];
  activities: any[];
  restaurants: any[];
  guides: any[];
  translators: any[];
  transports: any[];
  gifts: any[];
};

export function useOfferForm(cms: CMSEntities) {
  const { formData, setFormData, handleInputChange } = useOfferState();
  const errors = useValidation(formData);
  useDatesAndDays(formData, setFormData);

  const accommodation = useAccommodation(formData, setFormData);
  const land = useLandServices(formData, setFormData, cms);

  const addServiceToDay = (dayId: string) => {
    const newService: ServiceEntry = {
      id: generateId(),
      serviceType: "activity",
      serviceId: "",
      quantityPersons: 1,
      quantityDays: 1,
      pricePerDayPerPerson: 0,
      comment: "",
      subtotal: 0,
    };
    const day = formData.landServices.find((d) => d.id === dayId);
    if (day) land.updateDayService(dayId, { services: [...day.services, newService] });
  };

  const removeService = (dayId: string, serviceId: string) => {
    const day = formData.landServices.find((d) => d.id === dayId);
    if (!day) return;
    land.updateDayService(dayId, { services: day.services.filter((s) => s.id !== serviceId) });
  };

  const { totalOfferCost, pricePerPerson } = useTotals(
    formData,
    accommodation.accommodationStats.totalCost,
    land.landServicesStats.totalCost
  );

  return {
    formData,
    setFormData,
    errors,
    handleInputChange,
    ...accommodation,
    updateDayService: land.updateDayService,
    addServiceToDay,
    updateService: land.updateService,
    removeService,
    getServiceOptions: land.getServiceOptions,
    getCMSEntity: land.getCMSEntity,
    landServicesStats: land.landServicesStats,
    totalOfferCost,
    pricePerPerson,
  };
}


