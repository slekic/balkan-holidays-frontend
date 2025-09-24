import { useMemo } from "react";
import { OfferFormData, HotelEntry, RoomTypeEntry } from "../../../types/offer";
import { generateId } from "../utils/id";

export function useAccommodation(formData: OfferFormData, setFormData: (updater: any) => void) {
  // --- statistika smestaja ---
  const accommodationStats = useMemo(() => {
  let totalCost = 0;
  let totalPersonsInHotels = 0;

  formData.hotels.forEach((hotel) => {
    const checkIn = new Date(hotel.checkIn);
    const checkOut = new Date(hotel.checkOut);
    const nights = Math.max(Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)), 0);

    const roomCosts = hotel.roomTypes.reduce(
      (sum, room) => sum + room.numberOfPersons * room.pricePerNightPerPerson * nights,
      0
    );

    const cityTaxTotal =
      nights *
      hotel.roomTypes.reduce((sum, room) => sum + room.numberOfPersons, 0) *
      hotel.cityTax.pricePerPersonPerDay;

    hotel.subtotal = roomCosts + cityTaxTotal;

    totalCost += hotel.subtotal;
    totalPersonsInHotels += hotel.roomTypes.reduce((sum, room) => sum + room.numberOfPersons, 0);
  });

  const totalNights = formData.hotels.reduce((sum, h) => {
    const checkIn = new Date(h.checkIn);
    const checkOut = new Date(h.checkOut);
    return sum + Math.max(Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)), 0);
  }, 0);

  return {
    totalNights,
    totalPersons: totalPersonsInHotels,
    totalCost,
    canAddHotel: totalNights < formData.numberOfDays,
    remainingNights: formData.numberOfDays - totalNights,
    remainingPersons: Math.max(formData.numberOfPersons - totalPersonsInHotels, 0),
  };
}, [formData.hotels, formData.numberOfDays, formData.numberOfPersons]);
  // --- dodavanje hotela ---
  const addHotel = () => {
    const newHotel: HotelEntry = {
      id: generateId(),
      hotelId: "",
      checkIn: formData.startDate,
      checkOut: formData.endDate,
      nights: formData.numberOfDays,
      roomTypes: [],
      cityTax: { pricePerPersonPerDay: 0, comment: "" },
      subtotal: 0
    };
    setFormData((prev: OfferFormData) => ({ ...prev, hotels: [...prev.hotels, newHotel] }));
  };

  const updateHotel = (hotelId: string, updates: Partial<HotelEntry>) => {
  setFormData((prev: OfferFormData) => ({
    ...prev,
    hotels: prev.hotels.map((hotel) => {
      if (hotel.id !== hotelId) return hotel;

      const updatedHotel = { ...hotel, ...updates } as HotelEntry;

      const checkIn = new Date(updatedHotel.checkIn);
      const checkOut = new Date(updatedHotel.checkOut);
      const nights = Math.max(Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000*60*60*24)), 0);
      updatedHotel.nights = nights;

      // preračunaj subtotal po sobama i boravišnoj taksi
      updatedHotel.roomTypes = updatedHotel.roomTypes.map((room) => ({
        ...room,
        totalCost: room.numberOfPersons * room.pricePerNightPerPerson * nights
      }));

      const roomCosts = updatedHotel.roomTypes.reduce((sum, room) => sum + room.totalCost, 0);
      const cityTaxTotal = nights * updatedHotel.roomTypes.reduce((sum, room) => sum + room.numberOfPersons, 0) * updatedHotel.cityTax.pricePerPersonPerDay;
      updatedHotel.subtotal = roomCosts + cityTaxTotal;

      return updatedHotel;
    }),
  }));
};

const updateRoomType = (hotelId: string, roomTypeId: string, updates: Partial<RoomTypeEntry>) => {
  const hotel = formData.hotels.find((h) => h.id === hotelId);
  if (!hotel) return;

  const checkIn = new Date(hotel.checkIn);
  const checkOut = new Date(hotel.checkOut);
  const nights = Math.max(Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000*60*60*24)), 0);

  const updatedRoomTypes = hotel.roomTypes.map((room) => {
    if (room.id !== roomTypeId) return room;
    return {
      ...room,
      ...updates,
      totalCost: (updates.numberOfPersons ?? room.numberOfPersons) * (updates.pricePerNightPerPerson ?? room.pricePerNightPerPerson) * nights
    };
  });

  updateHotel(hotelId, { roomTypes: updatedRoomTypes });
};

  const removeHotel = (hotelId: string) => {
    if (typeof window === "undefined" || window.confirm("Are you sure you want to remove this hotel?")) {
      setFormData((prev: OfferFormData) => ({ ...prev, hotels: prev.hotels.filter((h) => h.id !== hotelId) }));
    }
  };

  const addRoomType = (hotelId: string) => {
    const newRoomType: RoomTypeEntry = {
      id: generateId(),
      roomTypeId: "",
      roomTypeName: "",
      numberOfPersons: 1,
      pricePerNightPerPerson: 0,
      comment: "",
      totalCost: 0,
    };
    const hotel = formData.hotels.find((h) => h.id === hotelId);
    updateHotel(hotelId, { roomTypes: [...(hotel?.roomTypes || []), newRoomType] });
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

  return {
    accommodationStats,
    addHotel,
    updateHotel,
    removeHotel,
    addRoomType,
    updateRoomType,
    removeRoomType,
    canAddRoomType,
  };
}
