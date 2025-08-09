import { useMemo } from "react";
import { DayService, OfferFormData, ServiceEntry } from "../../../types/offer";

type CMSEntities = {
  activities: any[];
  restaurants: any[];
  guides: any[];
  translators: any[];
  transports: any[];
  gifts: any[];
};

export function useLandServices(
  formData: OfferFormData,
  setFormData: (updater: any) => void,
  cms: CMSEntities
) {
  const { activities, restaurants, guides, translators, transports, gifts } = cms;

  const updateDayService = (dayId: string, updates: Partial<DayService>) => {
    setFormData((prev: OfferFormData) => ({
      ...prev,
      landServices: prev.landServices.map((day) => {
        if (day.id !== dayId) return day;
        const updatedDay = { ...day, ...updates } as DayService;
        updatedDay.subtotal = updatedDay.services.reduce((sum, s) => sum + s.subtotal, 0);
        return updatedDay;
      }),
    }));
  };

  const getCMSEntity = (serviceType: string, serviceId: string) => {
    switch (serviceType) {
      case "activity":
        return activities.find((a) => a.id === serviceId);
      case "restaurant":
        return restaurants.find((r) => r.id === serviceId);
      case "guide":
        return guides.find((g) => g.id === serviceId);
      case "translator":
        return translators.find((t) => t.id === serviceId);
      case "transport":
        return transports.find((t) => t.id === serviceId);
      case "gift":
        return gifts.find((g) => g.id === serviceId);
      default:
        return null;
    }
  };

  const getServiceOptions = (serviceType: string) => {
    switch (serviceType) {
      case "activity":
        return activities;
      case "restaurant":
        return restaurants;
      case "guide":
        return guides;
      case "translator":
        return translators;
      case "transport":
        return transports;
      case "gift":
        return gifts;
      default:
        return [];
    }
  };

  const updateService = (dayId: string, serviceId: string, updates: Partial<ServiceEntry>) => {
    const day = formData.landServices.find((d) => d.id === dayId);
    if (!day) return;
    const updatedServices = day.services.map((service) => {
      if (service.id !== serviceId) return service;
      const updatedService = { ...service, ...updates } as ServiceEntry;
      if (updates.serviceId && updates.serviceType) {
        const cmsEntity = getCMSEntity(updates.serviceType, updates.serviceId);
        if (cmsEntity && "defaultComment" in cmsEntity) {
          (updatedService as any).comment = (cmsEntity as any).defaultComment;
        }
      }
      updatedService.subtotal =
        updatedService.quantityPersons * updatedService.quantityDays * updatedService.pricePerDayPerPerson;
      return updatedService;
    });
    updateDayService(dayId, { services: updatedServices });
  };

  const landServicesStats = useMemo(() => {
    const totalCost = formData.landServices.reduce((sum, day) => sum + day.subtotal, 0);
    const totalServices = formData.landServices.reduce((sum, day) => sum + day.services.length, 0);
    const daysWithServices = formData.landServices.filter((day) => day.services.length > 0).length;
    return { totalCost, totalServices, daysWithServices };
  }, [formData.landServices]);

  return {
    updateDayService,
    updateService,
    getServiceOptions,
    getCMSEntity,
    landServicesStats,
  };
}


