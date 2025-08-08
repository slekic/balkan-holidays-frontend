import { useEffect, useMemo, useState } from "react";
import { OfferFormData, DayService, ServiceEntry, HotelEntry, RoomTypeEntry } from "../../../types/offer";
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
  const { hotels, activities, restaurants, guides, translators, transports, gifts } = cms;

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

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-calc number of days and generate day services
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setFormData((prev) => ({
        ...prev,
        numberOfDays: diffDays,
        landServices: generateDayServices(prev.startDate, prev.endDate, prev.landServices),
      }));
    }
  }, [formData.startDate, formData.endDate]);

  const generateDayServices = (
    startDate: string,
    endDate: string,
    existingServices: DayService[]
  ): DayService[] => {
    if (!startDate || !endDate) return [];

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days: DayService[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      const existingDay = existingServices.find((service) => service.date === dateStr);

      if (existingDay) {
        days.push(existingDay);
      } else {
        days.push({
          id: generateId(),
          date: dateStr,
          dayTitle: `Day ${days.length + 1}`,
          services: [],
          subtotal: 0,
        });
      }
    }

    return days;
  };

  // Validation
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

  const handleInputChange = (field: keyof OfferFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Accommodation calculations
  const accommodationStats = useMemo(() => {
    const totalNights = formData.hotels.reduce((sum, hotel) => sum + hotel.nights, 0);
    const totalPersons = formData.hotels.reduce(
      (sum, hotel) =>
        sum + hotel.roomTypes.reduce((roomSum, room) => roomSum + room.numberOfPersons, 0),
      0
    );
    const totalCost = formData.hotels.reduce((sum, hotel) => sum + hotel.subtotal, 0);

    return {
      totalNights,
      totalPersons,
      totalCost,
      canAddHotel: totalNights < formData.numberOfDays,
      remainingNights: formData.numberOfDays - totalNights,
      remainingPersons: formData.numberOfPersons - totalPersons,
    };
  }, [formData.hotels, formData.numberOfDays, formData.numberOfPersons]);

  const addHotel = () => {
    const newHotel: HotelEntry = {
      id: generateId(),
      hotelId: "",
      checkIn: formData.startDate,
      checkOut: formData.endDate,
      nights: formData.numberOfDays,
      roomTypes: [],
      cityTax: { pricePerPersonPerDay: 0, comment: "" },
      subtotal: 0,
    };
    setFormData((prev) => ({ ...prev, hotels: [...prev.hotels, newHotel] }));
  };

  const updateHotel = (hotelId: string, updates: Partial<HotelEntry>) => {
    setFormData((prev) => ({
      ...prev,
      hotels: prev.hotels.map((hotel) => {
        if (hotel.id !== hotelId) return hotel;
        const updatedHotel = { ...hotel, ...updates } as HotelEntry;
        if (updates.checkIn || updates.checkOut) {
          const checkIn = new Date(updates.checkIn || hotel.checkIn);
          const checkOut = new Date(updates.checkOut || hotel.checkOut);
          const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
          updatedHotel.nights = nights;
        }
        const roomCosts = updatedHotel.roomTypes.reduce((sum, room) => sum + room.totalCost, 0);
        const cityTaxTotal =
          updatedHotel.nights *
          updatedHotel.roomTypes.reduce((sum, room) => sum + room.numberOfPersons, 0) *
          updatedHotel.cityTax.pricePerPersonPerDay;
        updatedHotel.subtotal = roomCosts + cityTaxTotal;
        return updatedHotel;
      }),
    }));
  };

  const removeHotel = (hotelId: string) => {
    if (typeof window === "undefined" || window.confirm("Are you sure you want to remove this hotel?")) {
      setFormData((prev) => ({ ...prev, hotels: prev.hotels.filter((h) => h.id !== hotelId) }));
    }
  };

  const addRoomType = (hotelId: string) => {
    const newRoomType: RoomTypeEntry = {
      id: generateId(),
      roomTypeId: "",
      numberOfPersons: 1,
      pricePerNightPerPerson: 0,
      comment: "",
      totalCost: 0,
    };
    const hotel = formData.hotels.find((h) => h.id === hotelId);
    updateHotel(hotelId, { roomTypes: [...(hotel?.roomTypes || []), newRoomType] });
  };

  const updateRoomType = (hotelId: string, roomTypeId: string, updates: Partial<RoomTypeEntry>) => {
    const hotel = formData.hotels.find((h) => h.id === hotelId);
    if (!hotel) return;
    const updatedRoomTypes = hotel.roomTypes.map((room) => {
      if (room.id !== roomTypeId) return room;
      const updatedRoom = { ...room, ...updates } as RoomTypeEntry;
      updatedRoom.totalCost = updatedRoom.numberOfPersons * updatedRoom.pricePerNightPerPerson * hotel.nights;
      return updatedRoom;
    });
    updateHotel(hotelId, { roomTypes: updatedRoomTypes });
  };

  const removeRoomType = (hotelId: string, roomTypeId: string) => {
    if (typeof window === "undefined" || window.confirm("Are you sure you want to remove this room type?")) {
      const hotel = formData.hotels.find((h) => h.id === hotelId);
      if (!hotel) return;
      updateHotel(hotelId, { roomTypes: hotel.roomTypes.filter((r) => r.id !== roomTypeId) });
    }
  };

  const canAddRoomType = (hotelId: string) => {
    const hotel = formData.hotels.find((h) => h.id === hotelId);
    if (!hotel) return false;
    const hotelPersons = hotel.roomTypes.reduce((sum, room) => sum + room.numberOfPersons, 0);
    return accommodationStats.remainingPersons > 0 || hotelPersons < formData.numberOfPersons;
  };

  // Land services
  const updateDayService = (dayId: string, updates: Partial<DayService>) => {
    setFormData((prev) => ({
      ...prev,
      landServices: prev.landServices.map((day) => {
        if (day.id !== dayId) return day;
        const updatedDay = { ...day, ...updates } as DayService;
        updatedDay.subtotal = updatedDay.services.reduce((sum, s) => sum + s.subtotal, 0);
        return updatedDay;
      }),
    }));
  };

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
    if (day) updateDayService(dayId, { services: [...day.services, newService] });
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

  const removeService = (dayId: string, serviceId: string) => {
    if (typeof window === "undefined" || window.confirm("Are you sure you want to remove this service?")) {
      const day = formData.landServices.find((d) => d.id === dayId);
      if (day) updateDayService(dayId, { services: day.services.filter((s) => s.id !== serviceId) });
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

  // Land services totals
  const landServicesStats = useMemo(() => {
    const totalCost = formData.landServices.reduce((sum, day) => sum + day.subtotal, 0);
    const totalServices = formData.landServices.reduce((sum, day) => sum + day.services.length, 0);
    const daysWithServices = formData.landServices.filter((day) => day.services.length > 0).length;
    return { totalCost, totalServices, daysWithServices };
  }, [formData.landServices]);

  // Offer totals
  const totalOfferCost = useMemo(() => {
    let total = 0;
    if (formData.accommodationEnabled) total += accommodationStats.totalCost;
    if (formData.landServicesEnabled) total += landServicesStats.totalCost;
    return total;
  }, [formData.accommodationEnabled, formData.landServicesEnabled, accommodationStats.totalCost, landServicesStats.totalCost]);

  const pricePerPerson = useMemo(() => {
    return formData.numberOfPersons > 0 ? totalOfferCost / formData.numberOfPersons : 0;
  }, [totalOfferCost, formData.numberOfPersons]);

  return {
    formData,
    setFormData,
    errors,
    handleInputChange,
    accommodationStats,
    addHotel,
    updateHotel,
    removeHotel,
    addRoomType,
    updateRoomType,
    removeRoomType,
    canAddRoomType,
    updateDayService,
    addServiceToDay,
    updateService,
    removeService,
    getServiceOptions,
    getCMSEntity,
    landServicesStats,
    totalOfferCost,
    pricePerPerson,
  };
}


