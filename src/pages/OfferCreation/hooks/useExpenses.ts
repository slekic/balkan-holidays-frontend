import { useEffect, useMemo, useState } from "react";
import { ExpenseEntry, DayService, HotelEntry } from "../../../types/offer";
import { RashodResponse } from "../../../api/responses";
import { entityTypeMapper } from "../../../utils/cms_response_mappers";

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
  offerId: number; // <--- Make sure offerId is passed
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

  const getDetectedEntities = async (): Promise<{ detected: ExpenseEntry[]; extras: ExpenseEntry[] }> => {
    const detected: ExpenseEntry[] = [];
    const extras: ExpenseEntry[] = [];
    const addedIds = new Set<string>();

    let existingRashodi: RashodResponse[] = [];

    if (offer && offer.offerId) {
      try {
        const res = await fetch(`http://localhost:8000/finansije/rashodi/ponuda/${offer.offerId}`);
        if (res.ok) existingRashodi = await res.json();
      } catch (err) {
        console.error("Failed to fetch existing rashodi", err);
      }
    }

    const findExisting = (entityType: string, entityId: number) =>
      existingRashodi.find(
        (r) => r.tipEntiteta === entityTypeMapper[entityType] && r.idEntiteta === entityId
      );

    // Hotels i land services (detektovani entiteti)
    if (offer.accommodationEnabled && offer.hotels) {
      offer.hotels.forEach((h) => {
        const hotel = hotels.find((hh) => hh.id === h.hotelId);
        if (hotel && !addedIds.has(hotel.id)) {
          const existing = findExisting("hotel", Number(hotel.id));
          detected.push({
            id: `hotel-${hotel.id}`,
            entityType: "hotel",
            entityId: hotel.id,
            entityName: hotel.name,
            costAmount: existing?.iznos || 0,
            comment: existing?.komentar || "",
            uploadedFile: undefined,
          });
          addedIds.add(hotel.id);
        }
      });
    }

    if (offer.landServicesEnabled && offer.landServices) {
      offer.landServices.forEach((day, dayIndex) => {
        day.services.forEach((service) => {
          let entityName = "";
          const entityId = service.serviceId;
          switch (service.serviceType) {
            case "activity":
              entityName = activities.find((a) => a.id === entityId)?.name || "";
              break;
            case "restaurant":
              entityName = restaurants.find((r) => r.id === entityId)?.name || "";
              break;
            case "guide":
              entityName = guides.find((g) => g.id === entityId)?.name || "";
              break;
            case "translator":
              entityName = translators.find((t) => t.id === entityId)?.name || "";
              break;
            case "transport":
              entityName = transports.find((t) => t.id === entityId)?.name || "";
              break;
            case "gift":
              entityName = gifts.find((g) => g.id === entityId)?.name || "";
              break;
          }

          const uniqueKey = `${service.serviceType}-${entityId}-day${dayIndex}`;

          if (entityName && !addedIds.has(uniqueKey)) {
            const existing = findExisting(service.serviceType, Number(entityId));
            detected.push({
              id: uniqueKey,
              entityType: service.serviceType,
              entityId,
              entityName,
              costAmount: existing?.iznos || 0,
              comment: existing?.komentar || "",
              uploadedFile: undefined,
            });
            addedIds.add(uniqueKey);
          }
        });
      });
    }

    // Other troškovi -> u extras
    existingRashodi
      .filter((r) => r.tipEntiteta === entityTypeMapper["other"])
      .forEach((r) => {
        if (!addedIds.has(`other-${r.nazivEntiteta}`)) {
          extras.push({
            id: `other-${r.id}`,
            entityType: "other",
            entityId: "0",
            entityName: r.nazivEntiteta || "",
            costAmount: r.iznos || 0,
            comment: r.komentar || "",
            uploadedFile: undefined,
          });
          addedIds.add(`other-${r.nazivEntiteta}`);
        }
      });

    return { detected, extras };
  };

  useEffect(() => {
    if (!expensesModalOpen) return;

    const fetchDetectedEntities = async () => {
      const { detected, extras } = await getDetectedEntities();
      setDetectedEntities(detected);
      setExpenses(extras); 
    };

    fetchDetectedEntities();
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
    };
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
