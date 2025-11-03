import React, { createContext, useContext, useState, useEffect } from 'react';
import { Hotel } from '../types/cms';
import { BaseEntityContext, BaseProviderProps, generateId, getCurrentTimestamp } from './base';
import { createHotel, deleteHotelApi, getAllHotels, updateHotelApi, uploadImages } from '../api/cms';
import { mapHotelResponse, mapHotelToRequest, mapPartialHotelToRequest } from '../utils/cms_response_mappers';
import { dataURLtoFile } from '../utils/image_converter';
import { toast } from 'react-toastify';


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

      const data: File[] = [];
      const img_types: string[] = [];
      // 2. Upload images if provided
      if (hotel.logo && hotel.logo != '') {
        data.push(dataURLtoFile(hotel.logo, "hotel-logo"+mappedHotel.id));
        img_types.push("logo"); 
      }

      if (hotel.images && hotel.images.length > 0) {
          for (let i = 0; i < hotel.images.length; i++) {
            const img = hotel.images[i];
            data.push(dataURLtoFile(img, `hotel-image-${mappedHotel.id}-${i}`));
            img_types.push("slika");  
          }
      }

      if (data.length > 0){
        console.log("UBACUJEM ", data.length)
        const res = await uploadImages(
            Number(mappedHotel.id),
            "hotel",
            data,
            img_types,
            []
        );
                
        mappedHotel.logo = res.slike
                    .filter((s: { tip: string }) => s.tip === "logo")
                    .map((s: { putanja: string }) => s.putanja)[0] ?? mappedHotel.logo;
      
        if (Array.isArray(res.slike)) {
          mappedHotel.images = res.slike
                    .filter((s: { tip: string }) => s.tip === "slika")
                    .map((s: { putanja: string }) => s.putanja) || mappedHotel.images;
          }
      }

      setHotels(prev => [...prev, mappedHotel]);

      return mappedHotel;
    } catch (error: any) {
      if (error.message.includes("Nepodržani tip")){
        toast.error(error.message)
      }
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

      const data: File[] = [];
      const img_types: string[] = [];
      const pathsToRemove: string[] = [];
      
      let logoChanged = false;
      mappedHotel.logo = hotel.logo;
      
      if (updates.logo !== hotel.logo) {
          // logo is different → upload new image
          pathsToRemove.push(
            ...[hotel.logo ? hotel.logo : undefined]
                .filter((p): p is string => !!p)
          );
            
          if (updates.logo !== undefined && updates.logo !== "") {
              data.push(dataURLtoFile(updates.logo, `hotel-logo${id}`));
              img_types.push("logo");
          }else{
              mappedHotel.logo = undefined
          }
          logoChanged = true;
      }
      if (updates.images || hotel.images.length > 0) {    
        const diff = (!updates.images || updates.images.length === 0)
                      ? hotel.images
                      : hotel.images.filter(existing => !updates.images?.includes(existing));
        const keep = (!updates.images || updates.images.length === 0)
                      ? []
                      : hotel.images.filter(existing => updates.images?.includes(existing));
        pathsToRemove.push(...diff);
            
        const toRemove = (logoChanged) ? pathsToRemove.length - 1 : pathsToRemove.length
        if (toRemove == 0 && hotel.images.length == updates.images?.length) {
              mappedHotel.images = hotel.images
        } else {
              const newImages = updates.images?.filter(img => !hotel.images.includes(img)) || [];
              if (newImages.length > 0) {
                  for (let i = 0; i < newImages.length; i++) {
                    const img = newImages[i];
                              
                    data.push(dataURLtoFile(img, `hotel-image-${id}-${i}`));
                    img_types.push("slika");
                  }
              }
              mappedHotel.images = keep
              console.log("Uploading images:", data, img_types, pathsToRemove);  
        }
      } 
      if (data.length > 0 || pathsToRemove.length > 0) {
          const res = await uploadImages(
                Number(id),
                "hotel",
                data,
                img_types,
                pathsToRemove
          );
      
          if (res && Array.isArray(res.slike)) {
                mappedHotel.logo =
                  res.slike.find((s: { tip: string }) => s.tip === "logo")?.putanja ??
                  mappedHotel.logo;
      
                const newImages = res.slike
                  .filter((s: { tip: string }) => s.tip === "slika")
                  .map((s: { putanja: string }) => s.putanja);
      
                mappedHotel.images = [...(mappedHotel.images ?? []), ...newImages];
              }
      }
      
            console.log("MAPIRANO " + JSON.stringify(mappedHotel))

      setHotels(prev =>
        prev.map(hotel =>
          hotel.id === id ? { ...hotel, ...mappedHotel, updatedAt: getCurrentTimestamp() } : hotel
        )
      );

      return mappedHotel;
    } catch (error: any) {
      if (error.message.includes("Nepodržani tip")){
        toast.error(error.message)
      }
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


