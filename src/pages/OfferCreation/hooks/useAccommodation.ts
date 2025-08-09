import { useMemo } from "react";
import { OfferFormData, HotelEntry, RoomTypeEntry } from "../../../types/offer";
import { generateId } from "../utils/id";

export function useAccommodation(formData: OfferFormData, setFormData: (updater: any) => void) {
  const accommodationStats = useMemo(() => {
    const totalNights = formData.hotels.reduce((sum, hotel) => sum + hotel.nights, 0);
    const totalPersons = formData.hotels.reduce(
      (sum, hotel) => sum + hotel.roomTypes.reduce((roomSum, room) => roomSum + room.numberOfPersons, 0),
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
    setFormData((prev: OfferFormData) => ({ ...prev, hotels: [...prev.hotels, newHotel] }));
  };

  const updateHotel = (hotelId: string, updates: Partial<HotelEntry>) => {
    setFormData((prev: OfferFormData) => ({
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
          updatedHotel.nights * updatedHotel.roomTypes.reduce((sum, room) => sum + room.numberOfPersons, 0) *
          updatedHotel.cityTax.pricePerPersonPerDay;
        updatedHotel.subtotal = roomCosts + cityTaxTotal;
        return updatedHotel;
      }),
    }));
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


