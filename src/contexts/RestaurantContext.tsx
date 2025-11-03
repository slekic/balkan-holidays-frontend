import React, { createContext, useContext, useEffect, useState } from 'react';
import { Restaurant } from '../types/cms';
import { BaseEntityContext, BaseProviderProps, getCurrentTimestamp } from './base';
import { createUsluga, deleteUslugaApi, getAllUsluge, updateUslugaApi, uploadImages } from '../api/cms';
import { mapRestaurantToRequest, mapUslugaToRestaurant } from '../utils/cms_response_mappers';
import { dataURLtoFile } from '../utils/image_converter';
import { toast } from 'react-toastify';


interface RestaurantContextType extends BaseEntityContext<Restaurant> {
  restaurants: Restaurant[];
  addRestaurant: (restaurant: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRestaurant: (id: string, restaurant: Partial<Restaurant>) => Promise<void>;
  deleteRestaurant: (id: string) => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: BaseProviderProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  // Load all restaurants on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getAllUsluge("restoran");
        setRestaurants(data.items.map(mapUslugaToRestaurant));
      } catch (err) {
        console.error("Failed to load restaurants:", err);
      }
    })();
  }, []);

  const addRestaurant = async (restaurant: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await createUsluga("restoran", mapRestaurantToRequest(restaurant));
      const mapped = mapUslugaToRestaurant(created);

      if (restaurant.images && restaurant.images.length > 0) {
          const data: File[] = [];
          const img_types: string[] = [];

          for (let i = 0; i < restaurant.images.length; i++) {
              const img = restaurant.images[i];
              // Only convert Base64 images to files
              data.push(dataURLtoFile(img, `restaurant-image-${mapped.id}-${i}`));
              img_types.push("slika");  
          }
      
            
          const res = await uploadImages(
              Number(mapped.id),
              "usluga",
              data,
              img_types,
              []
          );

          mapped.images = res.slike.map((s: { putanja: string }) => s.putanja) ?? mapped.images;
      } 
      setRestaurants(prev => [...prev, { ...mapped, createdAt: getCurrentTimestamp(), updatedAt: getCurrentTimestamp() }]);
    } catch (err: any) {
      if (err.message.includes("Nepodržani tip")){
          toast.error(err.message)
      }
      console.error("Failed to add restaurant:", err);
    }
  };

  const updateRestaurant = async (id: string, updates: Partial<Restaurant>) => {
    try {
      console.log("Updates" + updates)
      const updated = await updateUslugaApi(Number(id), {
        naziv: updates.name,
        komentar: updates.defaultComment,
        link_sajta: updates.websiteLink,
        sadrzaj: updates.description,
        pdv_grupa: updates.vatGroup
      });
      const mappedRestaurant = mapUslugaToRestaurant(updated);

      const restaurant = restaurants.find(r => r.id === id);
      if (!restaurant) throw new Error("Restaurant not found");

     // 2. Upload logo if provided
      if (updates.images || restaurant.images.length > 0) {
        console.log("Restoran " + restaurant.images)
        console.log("Update img "  + updates.images)
        const diff = (!updates.images || updates.images.length === 0)
                    ? restaurant.images
                    : restaurant.images.filter(existing => !updates.images?.includes(existing));
        const keep = (!updates.images || updates.images.length === 0)
                    ? []
                    : restaurant.images.filter(existing => updates.images?.includes(existing));
        const pathsToRemove = diff;

        console.log("za brisanje ", pathsToRemove)
        if (pathsToRemove.length == 0 && restaurant.images.length == updates.images?.length) {
          mappedRestaurant.images = restaurant.images
        } else {
          const data: File[] = [];
          const img_types: string[] = [];

          const newImages = updates.images?.filter(img => !restaurant.images.includes(img)) || [];
        // 3. Pripremi fajlove za upload samo za nove slike (Base64)
          if (newImages.length > 0) {
            for (let i = 0; i < newImages.length; i++) {
              const img = newImages[i];

              // Only convert Base64 (new) images to files
              
              data.push(dataURLtoFile(img, `restaurant-image-${id}-${i}`));
              img_types.push("slika");
              }
                
          }
      
          console.log("Uploading images:", data, img_types, pathsToRemove);

            // 4. Upload novih slika
          const res = await uploadImages(
              Number(id),
              "usluga",
              data,
              img_types,
              pathsToRemove
          );
          mappedRestaurant.images = keep.concat(res?.slike?.map((s: { putanja: string }) => s.putanja) ?? []);
        }
      } 
      setRestaurants(prev =>
        prev.map(r => r.id === id ? { ...mappedRestaurant, updatedAt: getCurrentTimestamp() } : r)
      );
    } catch (err: any) {
      if (err.message.includes("Nepodržani tip")){
          toast.error(err.message)
      }
      console.error("Failed to update restaurant:", err);
    }
  };

  const deleteRestaurant = async (id: string) => {
    try {
      await deleteUslugaApi(Number(id));
      setRestaurants(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error("Failed to delete restaurant:", err);
    }
  };

  return (
    <RestaurantContext.Provider value={{
      restaurants,
      items: restaurants,
      addRestaurant,
      addItem: addRestaurant,
      updateRestaurant,
      updateItem: updateRestaurant,
      deleteRestaurant,
      deleteItem: deleteRestaurant
    }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurants() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurants must be used within a RestaurantProvider');
  }
  return context;
}
