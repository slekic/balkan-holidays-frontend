import React, { createContext, useContext, useState, useEffect } from 'react';
import { Hotel } from '../types/cms';
import { BaseEntityContext, BaseProviderProps, generateId, getCurrentTimestamp } from './base';
import { createHotel, deleteHotelApi, getAllHotels, updateHotelApi, uploadImages } from '../api/cms';
import { mapHotelResponse, mapHotelToRequest, mapPartialHotelToRequest } from '../utils/cms_response_mappers';
import { dataURLtoFile } from '../utils/image_converter';


interface HotelContextType extends BaseEntityContext<Hotel> {
  hotels: Hotel[];
  addHotel: (hotel: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Hotel>;
  updateHotel: (id: string, hotel: Partial<Hotel>) => Promise<Hotel>;
  deleteHotel: (id: string) => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export function HotelProvider({ children }: BaseProviderProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    async function fetchHotels() {
      try {
        const res = await getAllHotels();
        console.log(res)
        const mapped = res.items.map(mapHotelResponse);
        setHotels(mapped);
      } catch (error) {
        console.error('Failed to fetch hotels', error);
      }
    }
    fetchHotels();
  }, []);

  const addHotel = async (
    hotel: Omit<Hotel, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      // 1. Create hotel on backend
      const created = await createHotel(mapHotelToRequest(hotel));
      const mappedHotel = mapHotelResponse(created);

      // 2. Upload images if provided
      if (hotel.logo && hotel.logo != '') {
        const res = await uploadImages(created.id, "hotel", [dataURLtoFile(hotel.logo, "hotel-logo"+mappedHotel.id)], ["logo"]);
        console.log(res)
        mappedHotel.logo=res ?? undefined
      }

      setHotels(prev => [...prev, mappedHotel]);

      return mappedHotel;
    } catch (error) {
      console.error("Failed to add hotel:", error);
      throw error;
    }
  };

  const updateHotel = async (
    id: string,
    updates: Partial<Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    try {
      // 1. Update hotel on backend
      
      const updatedHotelResponse = await updateHotelApi(id, mapPartialHotelToRequest(updates));
      const mappedHotel = mapHotelResponse(updatedHotelResponse);

      const hotel = hotels.find(h => h.id === id);
      if (!hotel) throw new Error("Hotel not found");

      // 2. Upload logo if provided
      if (updates.logo !== hotel.logo) {
        // logo is different → upload new image

        const pathToRemove = [hotel.logo ? hotel.logo : undefined]
                              .filter((p): p is string => !!p);
        let data: File[] = [];
        let img_type: string[] = [];
        if (updates.logo !== undefined && updates.logo !== "") {
          data = [dataURLtoFile(updates.logo, `hotel-logo${id}`)];
          img_type = ["logo"];
        }
        const res = await uploadImages(
          Number(id),
          "hotel",
          data,       
          img_type,
          pathToRemove
        );
        mappedHotel.logo = res ?? undefined;
      }

      setHotels(prev =>
        prev.map(hotel =>
          hotel.id === id ? { ...hotel, ...mappedHotel, updatedAt: getCurrentTimestamp() } : hotel
        )
      );

      return mappedHotel;
    } catch (error) {
      console.error("Failed to update hotel:", error);
      throw error;
    }
  };

  const deleteHotel = async (id: string) => {
  try {
    const res = await deleteHotelApi(id);
    console.log(res)
    setHotels(prev => prev.filter(hotel => hotel.id !== id));
  } catch (error) {
    console.error("Failed to delete hotel:", error);
    throw error;
  }
};


  return (
    <HotelContext.Provider value={{
      hotels,
      items: hotels,
      addHotel,
      addItem: addHotel,
      updateHotel,
      updateItem: updateHotel,
      deleteHotel,
      deleteItem: deleteHotel
    }}>
      {children}
    </HotelContext.Provider>
  );
}

export function useHotels() {
  const context = useContext(HotelContext);
  if (!context) throw new Error('useHotels must be used within a HotelProvider');
  return context;
}


