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
import { Client } from "../types/cms";
import {
  Calendar,
  MapPin,
  Users,
  FileText,
  Plus,
  X,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Bed,
  Trash2,
  Save,
  Download,
  DollarSign,
  Upload,
  Building2,
  Euro,
  MapPin as ServiceIcon,
  Clock,
  GripVertical,
  Edit,
  Image,
  Type,
  UtensilsCrossed,
  Gift as GiftIcon,
  Info,
} from "lucide-react";

interface Slide {
  id: string;
  type: "general" | "what-to-expect" | "day" | "hotel" | "restaurant" | "gift";
  title: string;
  content: any;
}

const slideTypeIcons = {
  general: Type,
  "what-to-expect": Info,
  day: Calendar,
  hotel: Building2,
  restaurant: UtensilsCrossed,
  gift: GiftIcon,
};

const slideTypeLabels = {
  general: "Opšti slajd",
  "what-to-expect": "Šta da očekujete",
  day: "Dnevni slajd",
  hotel: "Hotel slajd",
  restaurant: "Restoran slajd",
  gift: "Poklon slajd",
};

export default function OfferCreation() {
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
  const [otherExpenses, setOtherExpenses] = useState<ExpenseEntry[]>([]);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: "1",
      type: "general",
      title: "Welcome to Belgrade",
      content: {
        description:
          "Discover the vibrant capital of Serbia with our expertly crafted tour experience.",
        logo: "https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
      },
    },
    {
      id: "2",
      type: "what-to-expect",
      title: "What to Expect from Us",
      content: {},
    },
    {
      id: "3",
      type: "day",
      title: "Day 1 - Belgrade City Tour",
      content: {
        dayNumber: 1,
        description:
          "Comprehensive introduction to Belgrade with major landmarks and cultural sites",
        backgroundImage:
          "https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
        images: [
          "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
          "https://images.pexels.com/photos/3573383/pexels-photo-3573383.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
          "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
        ],
      },
    },
    {
      id: "4",
      type: "day",
      title: "Day 2 - Cultural Heritage",
      content: {
        dayNumber: 2,
        description:
          "Deep dive into Serbian culture, traditions, and historical significance",
        backgroundImage:
          "https://images.pexels.com/photos/1659439/pexels-photo-1659439.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
        images: [
          "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
          "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
          "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
        ],
      },
    },
    {
      id: "5",
      type: "hotel",
      title: "Hotel Metropol Palace",
      content: {
        name: "Hotel Metropol Palace",
        websiteLink: "https://metropolpalace.com",
        logo: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
        description:
          "Luxury hotel in the heart of Belgrade with exceptional service and amenities",
        numberOfRooms: 236,
        numberOfRestaurants: 3,
        images: [
          "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
          "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
          "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
        ],
      },
    },
    {
      id: "6",
      type: "restaurant",
      title: "Restoran Tri Šešira",
      content: {
        name: "Restoran Tri Šešira",
        websiteLink: "https://trisesira.rs",
        description:
          "Authentic Serbian restaurant in Skadarlija offering traditional cuisine and live music",
        images: [
          "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
          "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
          "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
          "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
        ],
      },
    },
  ]);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [showAddSlideModal, setShowAddSlideModal] = useState(false);
  const [newSlideType, setNewSlideType] = useState<Slide["type"]>("general");
  const [draggedSlide, setDraggedSlide] = useState<string | null>(null);

  const mockDetectedEntities = [
    {
      id: "detected-hotel-1",
      entityType: "hotel",
      entityId: "1",
      entityName: "Hotel Metropol Palace",
      costAmount: 0,
      comment: "",
      uploadedFile: undefined,
    },
    {
      id: "detected-restaurant-1",
      entityType: "restaurant",
      entityId: "1",
      entityName: "Tri šešira",
      costAmount: 0,
      comment: "",
      uploadedFile: undefined,
    },
  ];

  const [detectedEntities, setDetectedEntities] =
    useState<ExpenseEntry[]>(mockDetectedEntities);

  // Auto-detect entities from the current offer
  const getDetectedEntities = (): ExpenseEntry[] => {
    const detectedEntities: ExpenseEntry[] = [];
    const addedEntityIds = new Set<string>();

    // Detect hotels from accommodation
    if (formData.accommodationEnabled && formData.hotels) {
      formData.hotels.forEach((hotelEntry) => {
        const hotel = hotels.find((h) => h.id === hotelEntry.hotelId);
        if (hotel && !addedEntityIds.has(hotel.id)) {
          detectedEntities.push({
            id: `hotel-${hotel.id}`,
            entityType: "hotel",
            entityId: hotel.id,
            entityName: hotel.name,
            costAmount: 0,
            comment: "",
            uploadedFile: undefined,
          });
          addedEntityIds.add(hotel.id);
        }
      });
    }

    // Detect entities from land services
    if (formData.landServicesEnabled && formData.landServices) {
      formData.landServices.forEach((dayService) => {
        dayService.services.forEach((service) => {
          let entity = null;
          let entityName = "";

          switch (service.serviceType) {
            case "activity":
              entity = activities.find((a) => a.id === service.serviceId);
              entityName = entity?.name || "Unknown Activity";
              break;
            case "restaurant":
              entity = restaurants.find((r) => r.id === service.serviceId);
              entityName = entity?.name || "Unknown Restaurant";
              break;
            case "guide":
              entity = guides.find((g) => g.id === service.serviceId);
              entityName = entity?.name || "Unknown Guide";
              break;
            case "translator":
              entity = translators.find((t) => t.id === service.serviceId);
              entityName = entity?.name || "Unknown Translator";
              break;
            case "transport":
              entity = transports.find((t) => t.id === service.serviceId);
              entityName = entity?.name || "Unknown Transport";
              break;
            case "gift":
              entity = gifts.find((g) => g.id === service.serviceId);
              entityName = entity?.name || "Unknown Gift";
              break;
          }

          if (entity && !addedEntityIds.has(entity.id)) {
            detectedEntities.push({
              id: `${service.serviceType}-${entity.id}`,
              entityType: service.serviceType,
              entityId: entity.id,
              entityName: entityName,
              costAmount: 0,
              comment: "",
              uploadedFile: undefined,
            });
            addedEntityIds.add(entity.id);
          }
        });
      });
    }

    return detectedEntities;
  };

  // Initialize detected entities when modal opens
  //const [detectedEntities, setDetectedEntities] = useState<ExpenseEntry[]>([]);

  React.useEffect(() => {
    if (expensesModalOpen) {
      const detected = getDetectedEntities();
      setDetectedEntities(detected);
    }
  }, [expensesModalOpen, formData]);

  // Auto-calculate number of days when dates change
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

  // Generate day services when dates change
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

  // Real-time validation
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.offerName.trim()) {
      newErrors.offerName = "Naziv ponude je obavezan";
    }

    if (!formData.offerCode.trim()) {
      newErrors.offerCode = "Šifra ponude je obavezna";
    }

    if (!formData.clientId) {
      newErrors.clientId = "Klijent mora biti izabran";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Lokacija je obavezna";
    }

    if (formData.numberOfPersons < 1) {
      newErrors.numberOfPersons = "Broj osoba mora biti najmanje 1";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Datum početka je obavezan";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Datum završetka je obavezan";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = "Datum završetka mora biti posle datuma početka";
      }
    }

    setErrors(newErrors);
  }, [formData]);

  // Calculate accommodation totals and validation
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

  const handleInputChange = (field: keyof OfferFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateId = () =>
    Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const addHotel = () => {
    const newHotel: HotelEntry = {
      id: generateId(),
      hotelId: "",
      checkIn: formData.startDate,
      checkOut: formData.endDate,
      nights: formData.numberOfDays,
      roomTypes: [],
      cityTax: {
        pricePerPersonPerDay: 0,
        comment: "",
      },
      subtotal: 0,
    };

    setFormData((prev) => ({
      ...prev,
      hotels: [...prev.hotels, newHotel],
    }));
  };

  const updateHotel = (hotelId: string, updates: Partial<HotelEntry>) => {
    setFormData((prev) => ({
      ...prev,
      hotels: prev.hotels.map((hotel) => {
        if (hotel.id === hotelId) {
          const updatedHotel = { ...hotel, ...updates };

          // Recalculate nights if dates changed
          if (updates.checkIn || updates.checkOut) {
            const checkIn = new Date(updates.checkIn || hotel.checkIn);
            const checkOut = new Date(updates.checkOut || hotel.checkOut);
            const nights = Math.ceil(
              (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
            );
            updatedHotel.nights = nights;
          }

          // Recalculate subtotal
          const roomCosts = updatedHotel.roomTypes.reduce(
            (sum, room) => sum + room.totalCost,
            0
          );
          const cityTaxTotal =
            updatedHotel.nights *
            updatedHotel.roomTypes.reduce(
              (sum, room) => sum + room.numberOfPersons,
              0
            ) *
            updatedHotel.cityTax.pricePerPersonPerDay;
          updatedHotel.subtotal = roomCosts + cityTaxTotal;

          return updatedHotel;
        }
        return hotel;
      }),
    }));
  };

  const removeHotel = (hotelId: string) => {
    if (confirm("Are you sure you want to remove this hotel?")) {
      setFormData((prev) => ({
        ...prev,
        hotels: prev.hotels.filter((hotel) => hotel.id !== hotelId),
      }));
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

    updateHotel(hotelId, {
      roomTypes: [
        ...(formData.hotels.find((h) => h.id === hotelId)?.roomTypes || []),
        newRoomType,
      ],
    });
  };

  const updateRoomType = (
    hotelId: string,
    roomTypeId: string,
    updates: Partial<RoomTypeEntry>
  ) => {
    const hotel = formData.hotels.find((h) => h.id === hotelId);
    if (!hotel) return;

    const updatedRoomTypes = hotel.roomTypes.map((room) => {
      if (room.id === roomTypeId) {
        const updatedRoom = { ...room, ...updates };
        // Recalculate total cost
        updatedRoom.totalCost =
          updatedRoom.numberOfPersons *
          updatedRoom.pricePerNightPerPerson *
          hotel.nights;
        return updatedRoom;
      }
      return room;
    });

    updateHotel(hotelId, { roomTypes: updatedRoomTypes });
  };

  const removeRoomType = (hotelId: string, roomTypeId: string) => {
    if (confirm("Are you sure you want to remove this room type?")) {
      const hotel = formData.hotels.find((h) => h.id === hotelId);
      if (!hotel) return;

      updateHotel(hotelId, {
        roomTypes: hotel.roomTypes.filter((room) => room.id !== roomTypeId),
      });
    }
  };

  const canAddRoomType = (hotelId: string) => {
    const hotel = formData.hotels.find((h) => h.id === hotelId);
    if (!hotel) return false;

    const hotelPersons = hotel.roomTypes.reduce(
      (sum, room) => sum + room.numberOfPersons,
      0
    );
    return (
      accommodationStats.remainingPersons > 0 ||
      hotelPersons < formData.numberOfPersons
    );
  };

  // Land Services functions
  const updateDayService = (dayId: string, updates: Partial<DayService>) => {
    setFormData((prev) => ({
      ...prev,
      landServices: prev.landServices.map((day) => {
        if (day.id === dayId) {
          const updatedDay = { ...day, ...updates };
          // Recalculate subtotal
          updatedDay.subtotal = updatedDay.services.reduce(
            (sum, service) => sum + service.subtotal,
            0
          );
          return updatedDay;
        }
        return day;
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
    if (day) {
      updateDayService(dayId, {
        services: [...day.services, newService],
      });
    }
  };

  const updateService = (
    dayId: string,
    serviceId: string,
    updates: Partial<ServiceEntry>
  ) => {
    const day = formData.landServices.find((d) => d.id === dayId);
    if (!day) return;

    const updatedServices = day.services.map((service) => {
      if (service.id === serviceId) {
        const updatedService = { ...service, ...updates };

        // Auto-populate comment from CMS if service changed
        if (updates.serviceId && updates.serviceType) {
          const cmsEntity = getCMSEntity(
            updates.serviceType,
            updates.serviceId
          );
          if (cmsEntity && "defaultComment" in cmsEntity) {
            updatedService.comment = cmsEntity.defaultComment;
          }
        }

        // Recalculate subtotal
        updatedService.subtotal =
          updatedService.quantityPersons *
          updatedService.quantityDays *
          updatedService.pricePerDayPerPerson;
        return updatedService;
      }
      return service;
    });

    updateDayService(dayId, { services: updatedServices });
  };

  const removeService = (dayId: string, serviceId: string) => {
    if (confirm("Are you sure you want to remove this service?")) {
      const day = formData.landServices.find((d) => d.id === dayId);
      if (day) {
        updateDayService(dayId, {
          services: day.services.filter((service) => service.id !== serviceId),
        });
      }
    }
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

  // Calculate land services totals
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

    return {
      totalCost,
      totalServices,
      daysWithServices,
    };
  }, [formData.landServices]);

  const handleNewClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newClientData.name.trim() || !newClientData.pib.trim()) {
      return;
    }

    const newClient = addClient({
      name: newClientData.name,
      pib: newClientData.pib,
    });

    // Set the newly created client as selected
    setFormData((prev) => ({
      ...prev,
      clientId: newClient.id,
    }));

    // Reset and close modal
    setNewClientData({ name: "", pib: "" });
    setShowNewClientModal(false);
  };

  const selectedClient = clients.find((c) => c.id === formData.clientId);

  // Auto-detect entities used in the offer for expenses
  const getUsedEntities = (): ExpenseEntry[] => {
    const entities: ExpenseEntry[] = [];

    // Add hotels
    if (formData.accommodationEnabled) {
      formData.hotels.forEach((hotel) => {
        const hotelData = hotels.find((h) => h.id === hotel.hotelId);
        if (hotelData) {
          entities.push({
            id: `hotel-${hotel.id}`,
            entityType: "hotel",
            entityId: hotel.hotelId,
            entityName: hotelData.name,
            costAmount: 0,
            comment: "",
          });
        }
      });
    }

    // Add services from land services
    if (formData.landServicesEnabled) {
      const usedServices = new Set<string>();

      formData.landServices.forEach((day) => {
        day.services.forEach((service) => {
          const key = `${service.serviceType}-${service.serviceId}`;
          if (!usedServices.has(key)) {
            usedServices.add(key);

            let entityName = "";
            switch (service.serviceType) {
              case "activity":
                entityName =
                  activities.find((a) => a.id === service.serviceId)?.name ||
                  "";
                break;
              case "restaurant":
                entityName =
                  restaurants.find((r) => r.id === service.serviceId)?.name ||
                  "";
                break;
              case "guide":
                entityName =
                  guides.find((g) => g.id === service.serviceId)?.name || "";
                break;
              case "translator":
                entityName =
                  translators.find((t) => t.id === service.serviceId)?.name ||
                  "";
                break;
              case "transport":
                entityName =
                  transports.find((t) => t.id === service.serviceId)?.name ||
                  "";
                break;
              case "gift":
                entityName =
                  gifts.find((g) => g.id === service.serviceId)?.name || "";
                break;
            }

            if (entityName) {
              entities.push({
                id: `${service.serviceType}-${service.serviceId}`,
                entityType: service.serviceType,
                entityId: service.serviceId,
                entityName,
                costAmount: 0,
                comment: "",
              });
            }
          }
        });
      });
    }

    return entities;
  };

  const removeExpense = (id: string) => {
    setOtherExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const handleSaveOffer = () => {
    if (!formData.clientId) {
      alert("Please select a client before saving");
      return;
    }

    alert("Offer saved successfully!");
    console.log("Saving offer:", formData);
  };

  const handleExportPDF = () => {
    alert("PDF export functionality would be implemented here");
    console.log("Exporting PDF for offer:", formData);
  };

  const handleExportExcel = () => {
    alert("Excel export functionality would be implemented here");
    console.log("Exporting Excel for offer:", formData);
  };

  const totalExpenses = [...detectedEntities, ...expenses].reduce(
    (sum, expense) => sum + expense.costAmount,
    0
  );

  // Calculate total offer cost and price per person
  const totalOfferCost = React.useMemo(() => {
    let total = 0;

    if (formData.accommodationEnabled) {
      total += accommodationStats.totalCost;
    }

    if (formData.landServicesEnabled) {
      total += landServicesStats.totalCost;
    }

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

  const updateDetectedEntity = (id: string, updates: Partial<ExpenseEntry>) => {
    setDetectedEntities((prev) =>
      prev.map((entity) =>
        entity.id === id ? { ...entity, ...updates } : entity
      )
    );
  };

  const getEntityTypeColor = (entityType: string) => {
    const colors = {
      hotel: "bg-blue-100 text-blue-800",
      activity: "bg-green-100 text-green-800",
      restaurant: "bg-orange-100 text-orange-800",
      guide: "bg-purple-100 text-purple-800",
      translator: "bg-pink-100 text-pink-800",
      transport: "bg-yellow-100 text-yellow-800",
      gift: "bg-red-100 text-red-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[entityType as keyof typeof colors] || colors.other;
  };

  const handleAddCustomExpense = () => {
    const newExpense: ExpenseEntry = {
      id: generateId(),
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
      prev.map((expense) =>
        expense.id === id ? { ...expense, ...updates } : expense
      )
    );
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const handleSlideReorder = (dragIndex: number, hoverIndex: number) => {
    const draggedSlide = slides[dragIndex];
    const newSlides = [...slides];
    newSlides.splice(dragIndex, 1);
    newSlides.splice(hoverIndex, 0, draggedSlide);
    setSlides(newSlides);
  };

  const handleDeleteSlide = (slideId: string) => {
    if (confirm("Are you sure you want to delete this slide?")) {
      setSlides(slides.filter((slide) => slide.id !== slideId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Kreiraj novu ponudu
          </h1>
          <p className="text-gray-600 mt-1">
            Kreiraj detaljnu turističku ponudu za klijenta
          </p>
        </div>
      </div>

      {/* General Information Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FileText className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Opšte informacije
            </h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Offer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Naziv ponude <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.offerName}
                onChange={(e) => handleInputChange("offerName", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.offerName ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="npr. Beogradsko kulturno iskustvo"
              />
              {errors.offerName && (
                <div className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.offerName}
                </div>
              )}
            </div>

            {/* Offer Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Šifra ponude <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.offerCode}
                onChange={(e) => handleInputChange("offerCode", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.offerCode ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="npr. BEL-2024-001"
              />
              {errors.offerCode && (
                <div className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.offerCode}
                </div>
              )}
            </div>

            {/* Client Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Klijent <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-2">
                <select
                  value={formData.clientId}
                  onChange={(e) =>
                    handleInputChange("clientId", e.target.value)
                  }
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.clientId ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Izaberi klijenta...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.pib})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewClientModal(true)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Dodaj novog klijenta"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {errors.clientId && (
                <div className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.clientId}
                </div>
              )}
              {selectedClient && (
                <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center text-sm text-blue-700">
                    <Building2 className="w-4 h-4 mr-2" />
                    <span className="font-medium">{selectedClient.name}</span>
                    <span className="ml-2 text-blue-600">
                      PIB: {selectedClient.pib}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokacija <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.location ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="npr. Belgrade, Serbia"
                />
              </div>
              {errors.location && (
                <div className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.location}
                </div>
              )}
            </div>

            {/* Number of Persons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Broj osoba <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  value={formData.numberOfPersons}
                  onChange={(e) =>
                    handleInputChange(
                      "numberOfPersons",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.numberOfPersons
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
              </div>
              {errors.numberOfPersons && (
                <div className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.numberOfPersons}
                </div>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Datum početka <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.startDate ? "border-red-300" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.startDate && (
                <div className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.startDate}
                </div>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Datum završetka <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.endDate ? "border-red-300" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.endDate && (
                <div className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.endDate}
                </div>
              )}
            </div>

            {/* Number of Days (Auto-calculated) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Broj dana
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.numberOfDays}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  Auto-calculated
                </div>
              </div>
            </div>

            {/* Option Field */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opcija (Dodatne napomene)
              </label>
              <textarea
                value={formData.option}
                onChange={(e) => handleInputChange("option", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bilo kakve dodatne napomene ili posebni zahtevi za ovu ponudu..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Accommodation Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bed className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Smeštaj</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Upravljaj boravcima u hotelima i raspodelom soba
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700 mr-3">
                  Omogući smeštaj
                </label>
                <button
                  type="button"
                  onClick={() =>
                    handleInputChange(
                      "accommodationEnabled",
                      !formData.accommodationEnabled
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.accommodationEnabled
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.accommodationEnabled
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setAccommodationExpanded(!accommodationExpanded)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {accommodationExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {accommodationExpanded && formData.accommodationEnabled && (
          <div className="p-6">
            {/* Accommodation Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {accommodationStats.totalNights}
                </div>
                <div className="text-sm text-gray-600">Ukupno noćenja</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {accommodationStats.remainingNights}
                </div>
                <div className="text-sm text-gray-600">Preostala noćenja</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {accommodationStats.totalPersons}
                </div>
                <div className="text-sm text-gray-600">Dodeljene osobe</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  €{accommodationStats.totalCost.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Cena</div>
              </div>
            </div>

            {/* Hotels List */}
            <div className="space-y-6">
              {formData.hotels.map((hotel, hotelIndex) => {
                const selectedHotel = hotels.find(
                  (h) => h.id === hotel.hotelId
                );
                const hotelPersons = hotel.roomTypes.reduce(
                  (sum, room) => sum + room.numberOfPersons,
                  0
                );

                return (
                  <div
                    key={hotel.id}
                    className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Hotel {hotelIndex + 1}
                        {selectedHotel && (
                          <span className="text-blue-600 ml-2">
                            - {selectedHotel.name}
                          </span>
                        )}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeHotel(hotel.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove hotel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Hotel Selection and Dates */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Izaberi hotel <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={hotel.hotelId}
                          onChange={(e) =>
                            updateHotel(hotel.id, { hotelId: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Izaberi hotel...</option>
                          {hotels.map((h) => (
                            <option key={h.id} value={h.id}>
                              {h.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Datum prijave <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={hotel.checkIn}
                          min={formData.startDate}
                          max={formData.endDate}
                          onChange={(e) =>
                            updateHotel(hotel.id, { checkIn: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Datum odjave <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={hotel.checkOut}
                          min={hotel.checkIn || formData.startDate}
                          max={formData.endDate}
                          onChange={(e) =>
                            updateHotel(hotel.id, { checkOut: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    {/* Hotel Info */}
                    {hotel.checkIn && hotel.checkOut && (
                      <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-blue-700">
                            <strong>{hotel.nights}</strong> noćenja (
                            {new Date(hotel.checkIn).toLocaleDateString()} -{" "}
                            {new Date(hotel.checkOut).toLocaleDateString()})
                          </span>
                          <span className="text-blue-700">
                            <strong>{hotelPersons}</strong> dodeljenih osoba
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Room Types */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-semibold text-gray-900">
                          Tipovi soba
                        </h4>
                        <button
                          type="button"
                          onClick={() => addRoomType(hotel.id)}
                          disabled={!canAddRoomType(hotel.id)}
                          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Dodaj tip sobe
                        </button>
                      </div>

                      {hotel.roomTypes.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Bed className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>Još uvek nisu dodati tipovi soba</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {hotel.roomTypes.map((roomType, roomIndex) => {
                            const selectedRoomType =
                              selectedHotel?.roomTypes.find(
                                (rt) => rt.id === roomType.roomTypeId
                              );

                            return (
                              <div
                                key={roomType.id}
                                className="border border-gray-200 rounded-lg p-4 bg-white"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="font-medium text-gray-900">
                                    Tip sobe {roomIndex + 1}
                                    {selectedRoomType && (
                                      <span className="text-gray-600 ml-2">
                                        - {selectedRoomType.name}
                                      </span>
                                    )}
                                  </h5>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeRoomType(hotel.id, roomType.id)
                                    }
                                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                    title="Remove room type"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Tip sobe{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                      value={roomType.roomTypeId}
                                      onChange={(e) =>
                                        updateRoomType(hotel.id, roomType.id, {
                                          roomTypeId: e.target.value,
                                        })
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                      required
                                    >
                                      <option value="">
                                        Izaberi tip sobe...
                                      </option>
                                      {selectedHotel?.roomTypes.map((rt) => (
                                        <option key={rt.id} value={rt.id}>
                                          {rt.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Osoba{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={roomType.numberOfPersons}
                                      onChange={(e) =>
                                        updateRoomType(hotel.id, roomType.id, {
                                          numberOfPersons:
                                            parseInt(e.target.value) || 1,
                                        })
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                      required
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Cena po noćenju po osobi{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                      <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                      <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={roomType.pricePerNightPerPerson}
                                        onChange={(e) =>
                                          updateRoomType(
                                            hotel.id,
                                            roomType.id,
                                            {
                                              pricePerNightPerPerson:
                                                parseFloat(e.target.value) || 0,
                                            }
                                          )
                                        }
                                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        required
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Komentar
                                    </label>
                                    <input
                                      type="text"
                                      value={roomType.comment}
                                      onChange={(e) =>
                                        updateRoomType(hotel.id, roomType.id, {
                                          comment: e.target.value,
                                        })
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                      placeholder="Excel comment"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Ukupna cena
                                    </label>
                                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-900">
                                      €{roomType.totalCost.toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* City Tax */}
                    <div className="mb-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">
                        Boravišna taksa
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cena po osobi po danu
                          </label>
                          <div className="relative">
                            <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={hotel.cityTax.pricePerPersonPerDay}
                              onChange={(e) =>
                                updateHotel(hotel.id, {
                                  cityTax: {
                                    ...hotel.cityTax,
                                    pricePerPersonPerDay:
                                      parseFloat(e.target.value) || 0,
                                  },
                                })
                              }
                              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Komentar
                          </label>
                          <input
                            type="text"
                            value={hotel.cityTax.comment}
                            onChange={(e) =>
                              updateHotel(hotel.id, {
                                cityTax: {
                                  ...hotel.cityTax,
                                  comment: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Excel comment"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ukupno - Boravišna taksa
                          </label>
                          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-900">
                            €
                            {(
                              hotel.nights *
                              hotelPersons *
                              hotel.cityTax.pricePerPersonPerDay
                            ).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hotel Subtotal */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          Hotel - Ukupno:
                        </span>
                        <span className="text-xl font-bold text-blue-600">
                          €{hotel.subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Hotel Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={addHotel}
                disabled={!accommodationStats.canAddHotel}
                className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                {accommodationStats.canAddHotel
                  ? `Dodaj hotel (${accommodationStats.remainingNights} noćenja preostalo)`
                  : "Sva noćenja su dodeljena"}
              </button>
            </div>
          </div>
        )}

        {accommodationExpanded && !formData.accommodationEnabled && (
          <div className="p-6 text-center text-gray-500">
            <Bed className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Smeštaj je onemogućen za ovu ponudu</p>
          </div>
        )}
      </div>

      {/* Land Services Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ServiceIcon className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Usluge po danima
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Definiši usluge za svaki dan ponude
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700 mr-3">
                  Omogući usluge po danima
                </label>
                <button
                  type="button"
                  onClick={() =>
                    handleInputChange(
                      "landServicesEnabled",
                      !formData.landServicesEnabled
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.landServicesEnabled ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.landServicesEnabled
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setLandServicesExpanded(!landServicesExpanded)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {landServicesExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {landServicesExpanded && formData.landServicesEnabled && (
          <div className="p-6">
            {/* Land Services Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {landServicesStats.totalServices}
                </div>
                <div className="text-sm text-gray-600">Ukupno usluga</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {landServicesStats.daysWithServices}
                </div>
                <div className="text-sm text-gray-600">Dani sa uslugama</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  €{landServicesStats.totalCost.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Ukupna cena</div>
              </div>
            </div>

            {/* Daily Timeline */}
            <div className="space-y-6">
              {formData.landServices.map((day, dayIndex) => (
                <div
                  key={day.id}
                  className="border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="font-semibold text-gray-900">
                            {new Date(day.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={day.dayTitle}
                            onChange={(e) =>
                              updateDayService(day.id, {
                                dayTitle: e.target.value,
                              })
                            }
                            className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Day title for PDF/Excel"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-600">
                          Ukupno:{" "}
                          <span className="text-blue-600">
                            €{day.subtotal.toFixed(2)}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => addServiceToDay(day.id)}
                          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Dodaj uslugu
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    {day.services.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ServiceIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>Nema dodatih usluga za ovaj dan</p>
                        <p className="text-sm">
                          Ovaj dan neće biti prikazan u eksportima
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {day.services.map((service, serviceIndex) => {
                          const serviceOptions = getServiceOptions(
                            service.serviceType
                          );
                          const selectedService = getCMSEntity(
                            service.serviceType,
                            service.serviceId
                          );

                          return (
                            <div
                              key={service.id}
                              className="border border-gray-200 rounded-lg p-4 bg-white"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-gray-900">
                                  Usluga {serviceIndex + 1}
                                  {selectedService && (
                                    <span className="text-blue-600 ml-2">
                                      - {selectedService.name}
                                    </span>
                                  )}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeService(day.id, service.id)
                                  }
                                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                  title="Remove service"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tip usluge{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <select
                                    value={service.serviceType}
                                    onChange={(e) =>
                                      updateService(day.id, service.id, {
                                        serviceType: e.target
                                          .value as ServiceEntry["serviceType"],
                                        serviceId: "", // Reset service selection when type changes
                                      })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    required
                                  >
                                    <option value="activity">Aktivnost</option>
                                    <option value="restaurant">Restoran</option>
                                    <option value="guide">Vodič</option>
                                    <option value="translator">
                                      Prevodilac
                                    </option>
                                    <option value="transport">Prevoz</option>
                                    <option value="gift">Poklon</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Naziv usluge{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <select
                                    value={service.serviceId}
                                    onChange={(e) =>
                                      updateService(day.id, service.id, {
                                        serviceId: e.target.value,
                                      })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    required
                                  >
                                    <option value="">
                                      Izaberi{" "}
                                      {getServiceTypeName(service.serviceType)}
                                      ...
                                    </option>
                                    {serviceOptions.map((option) => (
                                      <option key={option.id} value={option.id}>
                                        {option.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Osobe/Jedinice{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={service.quantityPersons}
                                    onChange={(e) =>
                                      updateService(day.id, service.id, {
                                        quantityPersons:
                                          parseInt(e.target.value) || 1,
                                      })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Broj dana{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={service.quantityDays}
                                    onChange={(e) =>
                                      updateService(day.id, service.id, {
                                        quantityDays:
                                          parseInt(e.target.value) || 1,
                                      })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cena osoba dan{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative">
                                    <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={service.pricePerDayPerPerson}
                                      onChange={(e) =>
                                        updateService(day.id, service.id, {
                                          pricePerDayPerPerson:
                                            parseFloat(e.target.value) || 0,
                                        })
                                      }
                                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                      required
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ukupno
                                  </label>
                                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-900">
                                    €{service.subtotal.toFixed(2)}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Komentar (Excel Export)
                                </label>
                                <textarea
                                  value={service.comment}
                                  onChange={(e) =>
                                    updateService(day.id, service.id, {
                                      comment: e.target.value,
                                    })
                                  }
                                  rows={2}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  placeholder="Komentar za Excel izvoz (automatski popunjen iz CMS-a)"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {landServicesExpanded && !formData.landServicesEnabled && (
          <div className="p-6 text-center text-gray-500">
            <ServiceIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Usluge po danima su onemogućene za ovu ponudu</p>
          </div>
        )}
      </div>

      {/* Summary and Actions - Sticky Bottom Bar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg mt-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Summary */}
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <p className="text-sm text-gray-600">Ukupna cena ponude</p>
                <p className="text-2xl font-bold text-gray-900">
                  €{totalOfferCost.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Cena po osobi</p>
                <p className="text-xl font-semibold text-blue-600">
                  €{pricePerPerson.toFixed(2)}
                </p>
              </div>
              {formData.numberOfPersons > 0 && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">Broj osoba</p>
                  <p className="text-lg font-medium text-gray-700">
                    {formData.numberOfPersons}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setExpensesModalOpen(true)}
                className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Rashodi
              </button>

              <button
                onClick={handleExportExcel}
                className="flex items-center px-4 py-2 text-green-700 border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </button>

              <button
                onClick={() => setShowPDFModal(true)}
                className="flex items-center px-4 py-2 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </button>

              <button
                onClick={handleSaveOffer}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Save className="w-4 h-4 mr-2" />
                Sačuvaj ponudu
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Modal */}
      {expensesModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Troškovi ponude
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Interno praćenje troškova za ovu ponudu
                </p>
              </div>
              <button
                onClick={() => setExpensesModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
              {/* Detected Entities from Offer Section */}
              <div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">
                    Detektovani entiteti iz ponude
                  </h4>
                  <p className="text-sm text-blue-700">
                    Ovi entiteti su automatski detektovani iz trenutne
                    konfiguracije ponude
                  </p>
                </div>

                <div className="space-y-4">
                  {detectedEntities.map((entity) => (
                    <div
                      key={entity.id}
                      className="bg-blue-25 border border-blue-100 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEntityTypeColor(
                              entity.entityType
                            )}`}
                          >
                            {entity.entityType.charAt(0).toUpperCase() +
                              entity.entityType.slice(1)}
                          </span>
                          <span className="font-medium text-gray-900">
                            {entity.entityName}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Iznos troška (€)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              €
                            </span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={entity.costAmount || ""}
                              onChange={(e) =>
                                updateDetectedEntity(entity.id, {
                                  costAmount: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0.00"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Komentar
                          </label>
                          <input
                            type="text"
                            value={entity.comment}
                            onChange={(e) =>
                              updateDetectedEntity(entity.id, {
                                comment: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Interna napomena..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Otpremi fakturu/račun
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  updateDetectedEntity(entity.id, {
                                    uploadedFile: file,
                                  });
                                }
                              }}
                              className="flex-1 text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {entity.uploadedFile && (
                              <button
                                type="button"
                                onClick={() =>
                                  updateDetectedEntity(entity.id, {
                                    uploadedFile: undefined,
                                  })
                                }
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                                title="Remove file"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          {entity.uploadedFile && (
                            <p className="text-xs text-gray-600 mt-1">
                              {entity.uploadedFile.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Expenses Section */}
              <div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Ostali troškovi
                  </h4>
                  <p className="text-sm text-gray-600">
                    Dodaj posebne troškove koji nisu direktno povezani sa
                    entitetima ponude
                  </p>
                </div>

                <div className="space-y-4">
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="bg-gray-25 border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEntityTypeColor(
                              expense.entityType
                            )}`}
                          >
                            {expense.entityType.charAt(0).toUpperCase() +
                              expense.entityType.slice(1)}
                          </span>
                          <span className="font-medium text-gray-900">
                            {expense.entityName}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveExpense(expense.id)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Naziv troška
                          </label>
                          <input
                            type="text"
                            value={expense.entityName}
                            onChange={(e) =>
                              handleUpdateExpense(expense.id, {
                                entityName: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Unesite naziv troška"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cena troška (€)
                          </label>
                          <div className="relative">
                            <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={expense.costAmount || ""}
                              onChange={(e) =>
                                handleUpdateExpense(expense.id, {
                                  costAmount: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0.00"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Komentar
                          </label>
                          <input
                            type="text"
                            value={expense.comment}
                            onChange={(e) =>
                              handleUpdateExpense(expense.id, {
                                comment: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Interna napomena..."
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Otpremi fajl (faktura/račun)
                        </label>
                        <div className="flex items-center">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleUpdateExpense(expense.id, {
                                  uploadedFile: file,
                                });
                              }
                            }}
                            className="hidden"
                            id={`file-${expense.id}`}
                          />
                          <label
                            htmlFor={`file-${expense.id}`}
                            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <Upload className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {expense.uploadedFile
                                ? expense.uploadedFile.name
                                : "Izaberi fajl"}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={handleAddCustomExpense}
                  className="flex items-center px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Dodaj drugi trošak
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setExpensesModalOpen(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Otkaži
                  </button>
                  <button
                    onClick={() => {
                      setExpensesModalOpen(false);
                      alert("Expenses saved successfully!");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Sačuvaj rashode
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Export Modal */}
      {showPDFModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Generiši PDF prezentaciju
              </h2>
              <button
                onClick={() => setShowPDFModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Slajdovi prezentacije
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Prevuci za promenu redosleda, klikni za izmenu ili dodaj
                    nove slajdove
                  </p>
                </div>
                <button
                  onClick={() => setShowAddSlideModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Dodaj slajd
                </button>
              </div>

              <div className="space-y-4">
                {slides.map((slide, index) => {
                  const SlideIcon = slideTypeIcons[slide.type];
                  return (
                    <div
                      key={slide.id}
                      className={`bg-white border-2 rounded-lg p-4 transition-all ${
                        draggedSlide === slide.id
                          ? "border-blue-500 shadow-lg"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      draggable
                      onDragStart={() => setDraggedSlide(slide.id)}
                      onDragEnd={() => setDraggedSlide(null)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedSlide) {
                          const dragIndex = slides.findIndex(
                            (s) => s.id === draggedSlide
                          );
                          handleSlideReorder(dragIndex, index);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="flex items-center space-x-2">
                            <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                            <div className="flex items-center space-x-2">
                              <SlideIcon className="w-5 h-5 text-gray-600" />
                              <span className="text-sm font-medium text-gray-500">
                                {slideTypeLabels[slide.type]}
                              </span>
                            </div>
                          </div>

                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">
                              {slide.title}
                            </h4>

                            {/* Slide Preview Content */}
                            {slide.type === "general" && (
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                  {slide.content.description}
                                </p>
                                {slide.content.logo && (
                                  <img
                                    src={slide.content.logo}
                                    alt="Logo"
                                    className="w-16 h-12 object-cover rounded"
                                  />
                                )}
                              </div>
                            )}

                            {slide.type === "what-to-expect" && (
                              <p className="text-sm text-gray-600">
                                Fiksni šablon sa informacijama o kompaniji i
                                opisom usluga koje nudimo
                              </p>
                            )}

                            {slide.type === "day" && (
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                  Dan {slide.content.dayNumber}:{" "}
                                  {slide.content.description}
                                </p>
                                <div className="flex space-x-2">
                                  {slide.content.images
                                    ?.slice(0, 3)
                                    .map((img: string, i: number) => (
                                      <img
                                        key={i}
                                        src={img}
                                        alt={`Day ${i + 1}`}
                                        className="w-12 h-8 object-cover rounded"
                                      />
                                    ))}
                                </div>
                              </div>
                            )}

                            {slide.type === "hotel" && (
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                  {slide.content.description}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>
                                    {slide.content.numberOfRooms} soba
                                  </span>
                                  <span>
                                    {slide.content.numberOfRestaurants}{" "}
                                    restorana
                                  </span>
                                </div>
                                <div className="flex space-x-2">
                                  {slide.content.images
                                    ?.slice(0, 3)
                                    .map((img: string, i: number) => (
                                      <img
                                        key={i}
                                        src={img}
                                        alt={`Hotel ${i + 1}`}
                                        className="w-12 h-8 object-cover rounded"
                                      />
                                    ))}
                                </div>
                              </div>
                            )}

                            {slide.type === "restaurant" && (
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                  {slide.content.description}
                                </p>
                                <div className="flex space-x-2">
                                  {slide.content.images
                                    ?.slice(0, 4)
                                    .map((img: string, i: number) => (
                                      <img
                                        key={i}
                                        src={img}
                                        alt={`Restaurant ${i + 1}`}
                                        className="w-12 h-8 object-cover rounded"
                                      />
                                    ))}
                                </div>
                              </div>
                            )}

                            {slide.type === "gift" && (
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                  {slide.content.description}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>€{slide.content.price}</span>
                                  <span>{slide.content.whatsIncluded}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingSlide(slide)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit slide"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete slide"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setShowPDFModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Otkaži
              </button>
              <button
                onClick={() => {
                  console.log("Exporting PDF with slides:", slides);
                  alert("PDF export would start here!");
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Slide Modal */}
      {showAddSlideModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Dodaj novi slajd
              </h3>
              <button
                onClick={() => setShowAddSlideModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tip slajda
                  </label>
                  <select
                    value={newSlideType}
                    onChange={(e) =>
                      setNewSlideType(e.target.value as Slide["type"])
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">Opšti slajd</option>
                    <option value="what-to-expect">What to Expect</option>
                    <option value="day">Dan slajd</option>
                    <option value="hotel">Hotel slajd</option>
                    <option value="restaurant">Restoran slajd</option>
                    <option value="gift">Poklon slajd</option>
                  </select>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {newSlideType === "general" &&
                      "Kreiraj prilagođeni slajd sa naslovom, opisom i logoom"}
                    {newSlideType === "what-to-expect" &&
                      "Fiksni šablon slajda sa informacijama o uslugama kompanije"}
                    {newSlideType === "day" &&
                      "Slajd sa planom putovanja po danima, slikama i opisom"}
                    {newSlideType === "hotel" &&
                      "Slajd sa informacijama o hotelu, pogodnostima i slikama"}
                    {newSlideType === "restaurant" &&
                      "Prikaz restorana sa opisom kuhinje i ambijenta"}
                    {newSlideType === "gift" &&
                      "Detalji poklon paketa sa cenom i sadržajem"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddSlideModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Otkaži
              </button>
              <button
                onClick={() => {
                  const newSlide: Slide = {
                    id: Date.now().toString(),
                    type: newSlideType,
                    title: `New ${slideTypeLabels[newSlideType]}`,
                    content: {},
                  };
                  setSlides([...slides, newSlide]);
                  setShowAddSlideModal(false);
                  setEditingSlide(newSlide);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Dodaj slajd
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Slide Modal */}
      {editingSlide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Izmeni {slideTypeLabels[editingSlide.type]}
              </h3>
              <button
                onClick={() => setEditingSlide(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Naslov
                  </label>
                  <input
                    type="text"
                    value={editingSlide.title}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* General Slide Fields */}
                {editingSlide.type === "general" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opis
                      </label>
                      <textarea
                        value={editingSlide.content.description || ""}
                        onChange={(e) =>
                          setEditingSlide({
                            ...editingSlide,
                            content: {
                              ...editingSlide.content,
                              description: e.target.value,
                            },
                          })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo link
                      </label>
                      <input
                        type="url"
                        value={editingSlide.content.logo || ""}
                        onChange={(e) =>
                          setEditingSlide({
                            ...editingSlide,
                            content: {
                              ...editingSlide.content,
                              logo: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/logo.jpg"
                      />
                    </div>
                  </>
                )}

                {/* Day Slide Fields */}
                {editingSlide.type === "day" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Broj dana
                      </label>
                      <input
                        type="number"
                        value={editingSlide.content.dayNumber || 1}
                        onChange={(e) =>
                          setEditingSlide({
                            ...editingSlide,
                            content: {
                              ...editingSlide.content,
                              dayNumber: parseInt(e.target.value),
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opis
                      </label>
                      <textarea
                        value={editingSlide.content.description || ""}
                        onChange={(e) =>
                          setEditingSlide({
                            ...editingSlide,
                            content: {
                              ...editingSlide.content,
                              description: e.target.value,
                            },
                          })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pozadinska slika link
                      </label>
                      <input
                        type="url"
                        value={editingSlide.content.backgroundImage || ""}
                        onChange={(e) =>
                          setEditingSlide({
                            ...editingSlide,
                            content: {
                              ...editingSlide.content,
                              backgroundImage: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/background.jpg"
                      />
                    </div>
                  </>
                )}

                {/* Hotel Slide Fields */}
                {editingSlide.type === "hotel" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Izaberi hotel
                      </label>
                      <select
                        value={editingSlide.content.name || ""}
                        onChange={(e) =>
                          setEditingSlide({
                            ...editingSlide,
                            content: {
                              ...editingSlide.content,
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Izaberi hotel...</option>
                        <option value="Hotel Metropol Palace">
                          Hotel Metropol Palace
                        </option>
                        <option value="Hotel Square Nine">
                          Hotel Square Nine
                        </option>
                        <option value="Hyatt Regency Belgrade">
                          Hyatt Regency Belgrade
                        </option>
                      </select>
                    </div>
                  </>
                )}

                {/* Restaurant Slide Fields */}
                {editingSlide.type === "restaurant" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Izaberi restoran
                      </label>
                      <select
                        value={editingSlide.content.name || ""}
                        onChange={(e) =>
                          setEditingSlide({
                            ...editingSlide,
                            content: {
                              ...editingSlide.content,
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Izaberi restoran...</option>
                        <option value="Restoran Tri Šešira">
                          Restoran Tri Šešira
                        </option>
                        <option value="Manufaktura">Manufaktura</option>
                        <option value="Lorenzo & Kakalamba">
                          Lorenzo & Kakalamba
                        </option>
                      </select>
                    </div>
                  </>
                )}

                {/* Gift Slide Fields */}
                {editingSlide.type === "gift" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Izaberi poklon
                      </label>
                      <select
                        value={editingSlide.content.name || ""}
                        onChange={(e) =>
                          setEditingSlide({
                            ...editingSlide,
                            content: {
                              ...editingSlide.content,
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Izaberi poklon...</option>
                        <option value="Welcome Gift Package">
                          Welcome Gift Package
                        </option>
                        <option value="Premium Souvenir Set">
                          Premium Souvenir Set
                        </option>
                        <option value="Corporate Gift Box">
                          Corporate Gift Box
                        </option>
                      </select>
                    </div>
                  </>
                )}

                {/* What to Expect - No editable fields */}
                {editingSlide.type === "what-to-expect" && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Ovo je fiksni šablon slajda sa unapred definisanim
                      sadržajem o uslugama i obećanjima vaše kompanije. Sadržaj
                      se ne može menjati kako bi se očuvala konzistentnost u
                      svim prezentacijama.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setEditingSlide(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Otkaži
              </button>
              <button
                onClick={() => {
                  setSlides(
                    slides.map((slide) =>
                      slide.id === editingSlide.id ? editingSlide : slide
                    )
                  );
                  setEditingSlide(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Sačuvaj promene
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Client Modal */}
      {showNewClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Dodaj novog klijenta
              </h3>
              <button
                onClick={() => setShowNewClientModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleNewClientSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Naziv klijenta <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newClientData.name}
                  onChange={(e) =>
                    setNewClientData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="npr. ABC Travel Agency"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIB (poreski broj) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newClientData.pib}
                  onChange={(e) =>
                    setNewClientData((prev) => ({
                      ...prev,
                      pib: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  placeholder="npr. 123456789"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowNewClientModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Otkaži
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Dodaj klijenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
