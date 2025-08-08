// src/hooks/useOfferForm.ts

import React, { useState, useEffect } from "react";
import { useCMS } from "../contexts/CMSContext";
import {
  OfferFormData,
  DayService,
  ServiceEntry,
  HotelEntry,
  RoomTypeEntry,
  NewClientFormData,
  ExpenseEntry,
} from "../types/offer";
import { getEntityTypeColor, generateId } from "../utils/helpers";
import { slideTypeIcons, slideTypeLabels } from "../utils/constants";
import { Slide } from "../types/offer";

const useOfferForm = () => {
  const {
    clients,
    addClient,
    hotels,
    activities,
    restaurants,
    guides,
    translators,
    transports,
    gifts,
  } = useCMS();

  // --- State Management ---
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

  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [newClientData, setNewClientData] = useState<NewClientFormData>({
    name: "",
    pib: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [accommodationExpanded, setAccommodationExpanded] = useState(true);
  const [landServicesExpanded, setLandServicesExpanded] = useState(true);
  const [expensesModalOpen, setExpensesModalOpen] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]); // Initial slide data
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [showAddSlideModal, setShowAddSlideModal] = useState(false);
  const [newSlideType, setNewSlideType] = useState<Slide["type"]>("general");
  const [detectedEntities, setDetectedEntities] = useState<ExpenseEntry[]>([]);

  // --- Mappings and Utilities ---
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

  const getServiceTypeName = (serviceType: string) => {
    const names = {
      activity: "Activity",
      restaurant: "Restaurant",
      guide: "Guide",
      translator: "Translator",
      transport: "Transport",
      gift: "Gift",
    };
    return names[serviceType as keyof typeof names] || serviceType;
  };

  // --- Effects ---
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setFormData((prev) => ({
        ...prev,
        numberOfDays: diffDays,
        landServices: generateDayServices(
          prev.startDate,
          prev.endDate,
          prev.landServices
        ),
      }));
    }
  }, [formData.startDate, formData.endDate]);

  useEffect(() => {
    const newErrors: Record<string, string> = {};
    if (!formData.offerName.trim())
      newErrors.offerName = "Naziv ponude je obavezan";
    if (!formData.offerCode.trim())
      newErrors.offerCode = "Šifra ponude je obavezna";
    if (!formData.clientId) newErrors.clientId = "Klijent mora biti izabran";
    if (!formData.location.trim()) newErrors.location = "Lokacija je obavezna";
    if (formData.numberOfPersons < 1)
      newErrors.numberOfPersons = "Broj osoba mora biti najmanje 1";
    if (!formData.startDate) newErrors.startDate = "Datum početka je obavezan";
    if (!formData.endDate) newErrors.endDate = "Datum završetka je obavezan";
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) <= new Date(formData.startDate)
    ) {
      newErrors.endDate = "Datum završetka mora biti posle datuma početka";
    }
    setErrors(newErrors);
  }, [formData]);

  useEffect(() => {
    if (expensesModalOpen) {
      setDetectedEntities(getDetectedEntities());
    }
  }, [expensesModalOpen, formData]);

  // --- Derived State (Memoization) ---
  const accommodationStats = React.useMemo(() => {
    const totalNights = formData.hotels.reduce(
      (sum, hotel) => sum + hotel.nights,
      0
    );
    const totalPersons = formData.hotels.reduce(
      (sum, hotel) =>
        sum +
        hotel.roomTypes.reduce(
          (roomSum, room) => roomSum + room.numberOfPersons,
          0
        ),
      0
    );
    const totalCost = formData.hotels.reduce(
      (sum, hotel) => sum + hotel.subtotal,
      0
    );
    return {
      totalNights,
      totalPersons,
      totalCost,
      canAddHotel: totalNights < formData.numberOfDays,
      remainingNights: formData.numberOfDays - totalNights,
      remainingPersons: formData.numberOfPersons - totalPersons,
    };
  }, [formData.hotels, formData.numberOfDays, formData.numberOfPersons]);

  const landServicesStats = React.useMemo(() => {
    const totalCost = formData.landServices.reduce(
      (sum, day) => sum + day.subtotal,
      0
    );
    const totalServices = formData.landServices.reduce(
      (sum, day) => sum + day.services.length,
      0
    );
    const daysWithServices = formData.landServices.filter(
      (day) => day.services.length > 0
    ).length;
    return { totalCost, totalServices, daysWithServices };
  }, [formData.landServices]);

  const totalOfferCost = React.useMemo(() => {
    let total = 0;
    if (formData.accommodationEnabled) total += accommodationStats.totalCost;
    if (formData.landServicesEnabled) total += landServicesStats.totalCost;
    return total;
  }, [
    formData.accommodationEnabled,
    formData.landServicesEnabled,
    accommodationStats.totalCost,
    landServicesStats.totalCost,
  ]);

  const pricePerPerson = React.useMemo(() => {
    return formData.numberOfPersons > 0
      ? totalOfferCost / formData.numberOfPersons
      : 0;
  }, [totalOfferCost, formData.numberOfPersons]);

  // --- Handlers ---
  const handleInputChange = (field: keyof OfferFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
      const existingDay = existingServices.find(
        (service) => service.date === dateStr
      );
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

  // Accommodation handlers
  const addHotel = () => {
    /* ... (logic remains the same) ... */
  };
  const updateHotel = (hotelId: string, updates: Partial<HotelEntry>) => {
    /* ... (logic remains the same) ... */
  };
  const removeHotel = (hotelId: string) => {
    /* ... (logic remains the same) ... */
  };
  const addRoomType = (hotelId: string) => {
    /* ... (logic remains the same) ... */
  };
  const updateRoomType = (
    hotelId: string,
    roomTypeId: string,
    updates: Partial<RoomTypeEntry>
  ) => {
    /* ... (logic remains the same) ... */
  };
  const removeRoomType = (hotelId: string, roomTypeId: string) => {
    /* ... (logic remains the same) ... */
  };
  const canAddRoomType = (hotelId: string) => {
    /* ... (logic remains the same) ... */
  };

  // Land Services handlers
  const updateDayService = (dayId: string, updates: Partial<DayService>) => {
    /* ... (logic remains the same) ... */
  };
  const addServiceToDay = (dayId: string) => {
    /* ... (logic remains the same) ... */
  };
  const updateService = (
    dayId: string,
    serviceId: string,
    updates: Partial<ServiceEntry>
  ) => {
    /* ... (logic remains the same) ... */
  };
  const removeService = (dayId: string, serviceId: string) => {
    /* ... (logic remains the same) ... */
  };

  // Client handlers
  const handleNewClientSubmit = (e: React.FormEvent) => {
    /* ... (logic remains the same) ... */
  };

  // Expense handlers
  const getDetectedEntities = (): ExpenseEntry[] => {
    /* ... (logic remains the same) ... */
  };
  const handleAddCustomExpense = () => {
    /* ... (logic remains the same) ... */
  };
  const handleUpdateExpense = (id: string, updates: Partial<ExpenseEntry>) => {
    /* ... (logic remains the same) ... */
  };
  const handleRemoveExpense = (id: string) => {
    /* ... (logic remains the same) ... */
  };
  const updateDetectedEntity = (id: string, updates: Partial<ExpenseEntry>) => {
    /* ... (logic remains the same) ... */
  };

  // PDF Presentation handlers
  const handleSlideReorder = (dragIndex: number, hoverIndex: number) => {
    /* ... (logic remains the same) ... */
  };
  const handleDeleteSlide = (slideId: string) => {
    /* ... (logic remains the same) ... */
  };

  // Form submission & export handlers
  const handleSaveOffer = () => {
    /* ... (logic remains the same) ... */
  };
  const handleExportPDF = () => {
    /* ... (logic remains the same) ... */
  };
  const handleExportExcel = () => {
    /* ... (logic remains the same) ... */
  };

  return {
    // State
    formData,
    setFormData,
    showNewClientModal,
    setShowNewClientModal,
    newClientData,
    setNewClientData,
    errors,
    accommodationExpanded,
    setAccommodationExpanded,
    landServicesExpanded,
    setLandServicesExpanded,
    expenses,
    setExpenses,
    expensesModalOpen,
    setExpensesModalOpen,
    showPDFModal,
    setShowPDFModal,
    slides,
    setSlides,
    editingSlide,
    setEditingSlide,
    showAddSlideModal,
    setShowAddSlideModal,
    newSlideType,
    setNewSlideType,
    detectedEntities,
    setDetectedEntities,

    // Derived state
    accommodationStats,
    landServicesStats,
    totalOfferCost,
    pricePerPerson,

    // Handlers
    handleInputChange,
    handleNewClientSubmit,
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
    handleAddCustomExpense,
    handleUpdateExpense,
    handleRemoveExpense,
    updateDetectedEntity,
    handleSlideReorder,
    handleDeleteSlide,
    handleSaveOffer,
    handleExportPDF,
    handleExportExcel,

    // Utilities/Mappings
    getCMSEntity,
    getServiceOptions,
    getServiceTypeName,
    getEntityTypeColor,
    clients,
  };
};

export default useOfferForm;
