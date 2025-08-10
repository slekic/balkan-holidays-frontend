import React, { createContext, useContext, useState } from 'react';
import { Gift } from '../types/cms';
import { BaseEntityContext, BaseProviderProps, generateId, getCurrentTimestamp } from './base';

interface GiftContextType extends BaseEntityContext<Gift> {
  gifts: Gift[];
  addGift: (gift: Omit<Gift, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGift: (id: string, gift: Partial<Gift>) => void;
  deleteGift: (id: string) => void;
}

const GiftContext = createContext<GiftContextType | undefined>(undefined);

// Mock data
const mockGifts: Gift[] = [
  {
    id: '1',
    name: 'Welcome Gift Package',
    defaultComment: 'Traditional Serbian welcome gifts',
    description: 'Authentic Serbian souvenirs and local delicacies',
    price: 25.00,
    whatsIncluded: 'Serbian honey, rakija miniature, traditional handicraft, welcome card',
    image: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    vatGroup: '20%',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Premium Souvenir Set',
    defaultComment: 'High-quality Serbian crafts collection',
    description: 'Carefully selected premium souvenirs representing Serbian culture',
    price: 45.00,
    whatsIncluded: 'Handmade pottery, traditional textile, premium rakija, Serbian cookbook',
    image: 'https://images.pexels.com/photos/1303082/pexels-photo-1303082.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    vatGroup: '20%',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  },
  {
    id: '3',
    name: 'Corporate Gift Box',
    defaultComment: 'Business-appropriate Serbian gifts',
    description: 'Professional gift set suitable for corporate clients',
    price: 35.00,
    whatsIncluded: 'Serbian wine, branded notebook, traditional pen, company brochure',
    image: 'https://images.pexels.com/photos/1303083/pexels-photo-1303083.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    vatGroup: '20%',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  }
];

export function GiftProvider({ children }: BaseProviderProps) {
  const [gifts, setGifts] = useState<Gift[]>(mockGifts);

  const addGift = (gift: Omit<Gift, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGift: Gift = {
      ...gift,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setGifts(prev => [...prev, newGift]);
  };

  const updateGift = (id: string, updates: Partial<Gift>) => {
    setGifts(prev => prev.map(gift => 
      gift.id === id ? { ...gift, ...updates, updatedAt: getCurrentTimestamp() } : gift
    ));
  };

  const deleteGift = (id: string) => {
    setGifts(prev => prev.filter(gift => gift.id !== id));
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
  if (context === undefined) {
    throw new Error('useGifts must be used within a GiftProvider');
  }
  return context;
}
