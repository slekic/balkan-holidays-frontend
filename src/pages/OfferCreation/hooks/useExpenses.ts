import { useEffect, useMemo, useState } from "react";
import { ExpenseEntry, DayService, HotelEntry } from "../../../types/offer";

type CMSEntities = {
  hotels: { id: string; name: string }[];
  activities: { id: string; name: string }[];
  restaurants: { id: string; name: string }[];
  guides: { id: string; name: string }[];
  translators: { id: string; name: string }[];
  transports: { id: string; name: string }[];
  gifts: { id: string; name: string }[];
};

type OfferEssentials = {
  accommodationEnabled: boolean;
  hotels: HotelEntry[];
  landServicesEnabled: boolean;
  landServices: DayService[];
};

export function useExpenses(
  cms: CMSEntities,
  offer: OfferEssentials,
  expensesModalOpen: boolean
) {
  const {
    hotels,
    activities,
    restaurants,
    guides,
    translators,
    transports,
    gifts,
  } = cms;
  const [detectedEntities, setDetectedEntities] = useState<ExpenseEntry[]>([]);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);

  const getDetectedEntities = (): ExpenseEntry[] => {
    const results: ExpenseEntry[] = [];
    const addedIds = new Set<string>();
    if (offer.accommodationEnabled && offer.hotels) {
      offer.hotels.forEach((h) => {
        const hotel = hotels.find((hh) => hh.id === h.hotelId);
        if (hotel && !addedIds.has(hotel.id)) {
          results.push({
            id: `hotel-${hotel.id}`,
            entityType: "hotel",
            entityId: hotel.id,
            entityName: hotel.name,
            costAmount: 0,
            comment: "",
            uploadedFile: undefined,
          } as ExpenseEntry);
          addedIds.add(hotel.id);
        }
      });
    }
    if (offer.landServicesEnabled && offer.landServices) {
      offer.landServices.forEach((day) => {
        day.services.forEach((service) => {
          let entityName = "";
          const entityId = service.serviceId;
          switch (service.serviceType) {
            case "activity":
              entityName =
                activities.find((a) => a.id === service.serviceId)?.name || "";
              break;
            case "restaurant":
              entityName =
                restaurants.find((r) => r.id === service.serviceId)?.name || "";
              break;
            case "guide":
              entityName =
                guides.find((g) => g.id === service.serviceId)?.name || "";
              break;
            case "translator":
              entityName =
                translators.find((t) => t.id === service.serviceId)?.name || "";
              break;
            case "transport":
              entityName =
                transports.find((t) => t.id === service.serviceId)?.name || "";
              break;
            case "gift":
              entityName =
                gifts.find((g) => g.id === service.serviceId)?.name || "";
              break;
          }
          if (
            entityName &&
            !addedIds.has(`${service.serviceType}-${entityId}`)
          ) {
            results.push({
              id: `${service.serviceType}-${entityId}`,
              entityType: service.serviceType,
              entityId: entityId,
              entityName,
              costAmount: 0,
              comment: "",
              uploadedFile: undefined,
            } as ExpenseEntry);
            addedIds.add(`${service.serviceType}-${entityId}`);
          }
        });
      });
    }
    return results;
  };

  useEffect(() => {
    if (expensesModalOpen) {
      setDetectedEntities(getDetectedEntities());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    expensesModalOpen,
    offer.hotels,
    offer.landServices,
    offer.accommodationEnabled,
    offer.landServicesEnabled,
  ]);

  const updateDetectedEntity = (id: string, updates: Partial<ExpenseEntry>) => {
    setDetectedEntities((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const handleAddCustomExpense = () => {
    const newExpense: ExpenseEntry = {
      id: `${Date.now()}`,
      entityType: "other",
      entityId: "",
      entityName: "",
      costAmount: 0,
      comment: "",
      uploadedFile: undefined,
    } as ExpenseEntry;
    setExpenses((prev) => [...prev, newExpense]);
  };

  const handleUpdateExpense = (id: string, updates: Partial<ExpenseEntry>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const totalExpenses = useMemo(() => {
    return [...detectedEntities, ...expenses].reduce(
      (sum, e) => sum + (e.costAmount || 0),
      0
    );
  }, [detectedEntities, expenses]);

  return {
    detectedEntities,
    setDetectedEntities,
    expenses,
    setExpenses,
    updateDetectedEntity,
    handleAddCustomExpense,
    handleUpdateExpense,
    handleRemoveExpense,
    totalExpenses,
  };
}
