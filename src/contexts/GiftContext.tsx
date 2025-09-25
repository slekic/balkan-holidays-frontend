import React, { createContext, useContext, useEffect, useState } from 'react';
import { Gift } from '../types/cms';
import { BaseEntityContext, BaseProviderProps, getCurrentTimestamp } from './base';
import { createUsluga, deleteUslugaApi, getAllUsluge, updateUslugaApi, uploadImages } from '../api/cms';
import { mapUslugaToGift, mapGiftToRequest } from '../utils/cms_response_mappers';
import { dataURLtoFile } from '../utils/image_converter';

interface GiftContextType extends BaseEntityContext<Gift> {
  gifts: Gift[];
  addGift: (gift: Omit<Gift, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGift: (id: string, gift: Partial<Gift & { image?: string }>) => Promise<void>;
  deleteGift: (id: string) => Promise<void>;
}

const GiftContext = createContext<GiftContextType | undefined>(undefined);

export function GiftProvider({ children }: BaseProviderProps) {
  const [gifts, setGifts] = useState<Gift[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllUsluge("poklon");
        console.log(data)
        setGifts(data.items.map(mapUslugaToGift));
      } catch (err) {
        console.error("Failed to load gifts:", err);
      }
    })();
  }, []);

  const addGift = async (gift: Omit<Gift, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await createUsluga("poklon", mapGiftToRequest(gift));
      const mapped = mapUslugaToGift(created);

      if (gift.image && gift.image != '') {
          const res = await uploadImages(created.id, "usluga", [dataURLtoFile(gift.image, "gift-logo"+mapped.id)], ["logo"]);
          console.log(res)
          mapped.image=res ?? undefined
      }

      setGifts(prev => [...prev, { ...mapped, createdAt: getCurrentTimestamp(), updatedAt: getCurrentTimestamp() }]);
    } catch (err) {
      console.error("Failed to add gift:", err);
    }
  };

  const updateGift = async (id: string, updates: Partial<Gift & { image?: string }>) => {
    try {
      const updated = await updateUslugaApi(Number(id), {
        naziv: updates.name,
        komentar: updates.defaultComment,
        opis: updates.description,
        cena: updates.price,
        sadrzaj: updates.whatsIncluded,
        pdv_grupa: updates.vatGroup,
      });
      const mapped = mapUslugaToGift(updated);

      const gift = gifts.find(g => g.id === id);
      if (!gift) throw new Error("Gift not found");
      
      // 2. Upload logo if provided
      if (updates.image !== gift.image) {
          // logo is different → upload new image
          const pathToRemove = [gift.image ? gift.image : undefined]
                                .filter((p): p is string => !!p);
          let data: File[] = [];
          let img_type: string[] = [];
          if (updates.image !== undefined && updates.image !== "") {
              data = [dataURLtoFile(updates.image, `gift-logo${id}`)];
              img_type = ["logo"];
          }
          console.log("data " + data)
          const res = await uploadImages(
            Number(id),
            "usluga",
            data,       
            img_type,
            pathToRemove
          );
      
          mapped.image = res ?? mapped.image;
      }
      setGifts(prev => prev.map(g => g.id === id ? { ...mapped, updatedAt: getCurrentTimestamp() } : g));
    } catch (err) {
      console.error("Failed to update gift:", err);
    }
  };

  const deleteGift = async (id: string) => {
    try {
      await deleteUslugaApi(Number(id));
      setGifts(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      console.error("Failed to delete gift:", err);
    }
  };

  return (
    <GiftContext.Provider value={{
      gifts,
      items: gifts,
      addGift,
      addItem: addGift,
      updateGift,
      updateItem: updateGift,
      deleteGift,
      deleteItem: deleteGift
    }}>
      {children}
    </GiftContext.Provider>
  );
}

export function useGifts() {
  const context = useContext(GiftContext);
  if (!context) throw new Error('useGifts must be used within a GiftProvider');
  return context;
}
