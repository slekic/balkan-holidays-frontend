import React, { createContext, useContext, useState } from 'react';
import { Guide } from '../types/cms';
import { BaseEntityContext, BaseProviderProps, generateId, getCurrentTimestamp } from './base';

interface GuideContextType extends BaseEntityContext<Guide> {
  guides: Guide[];
  addGuide: (guide: Omit<Guide, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGuide: (id: string, guide: Partial<Guide>) => void;
  deleteGuide: (id: string) => void;
}

const GuideContext = createContext<GuideContextType | undefined>(undefined);

// Mock data
const mockGuides: Guide[] = [
  {
    id: '1',
    name: 'Belgrade City Guide - Stefan Nikolić',
    defaultComment: 'Expert local guide for Belgrade tours',
    vatGroup: 'Article 35',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Dinner Assistance Guide',
    defaultComment: 'Restaurant coordination and cultural explanation',
    vatGroup: 'Article 35',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  },
  {
    id: '3',
    name: 'Museum Guide - Art History',
    defaultComment: 'Specialized guide for museums and galleries',
    vatGroup: 'Article 35',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  }
];

export function GuideProvider({ children }: BaseProviderProps) {
  const [guides, setGuides] = useState<Guide[]>(mockGuides);

  const addGuide = (guide: Omit<Guide, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGuide: Guide = {
      ...guide,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setGuides(prev => [...prev, newGuide]);
  };

  const updateGuide = (id: string, updates: Partial<Guide>) => {
    setGuides(prev => prev.map(guide => 
      guide.id === id ? { ...guide, ...updates, updatedAt: getCurrentTimestamp() } : guide
    ));
  };

  const deleteGuide = (id: string) => {
    setGuides(prev => prev.filter(guide => guide.id !== id));
  };

  return (
    <GuideContext.Provider value={{
      guides,
      items: guides,
      addGuide,
      addItem: addGuide,
      updateGuide,
      updateItem: updateGuide,
      deleteGuide,
      deleteItem: deleteGuide
    }}>
      {children}
    </GuideContext.Provider>
  );
}

export function useGuides() {
  const context = useContext(GuideContext);
  if (context === undefined) {
    throw new Error('useGuides must be used within a GuideProvider');
  }
  return context;
}
