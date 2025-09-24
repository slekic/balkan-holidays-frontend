import React, { createContext, useContext, useEffect, useState } from 'react';
import { Guide } from '../types/cms';
import { BaseEntityContext, BaseProviderProps, getCurrentTimestamp } from './base';
import { createUsluga, deleteUslugaApi, getAllUsluge, updateUslugaApi } from '../api/cms';
import { mapGuideToRequest, mapUslugaToGuide } from '../utils/cms_response_mappers';

interface GuideContextType extends BaseEntityContext<Guide> {
  guides: Guide[];
  addGuide: (guide: Omit<Guide, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGuide: (id: string, guide: Partial<Guide & { images?: string[] }>) => Promise<void>;
  deleteGuide: (id: string) => Promise<void>;
}

const GuideContext = createContext<GuideContextType | undefined>(undefined);

export function GuideProvider({ children }: BaseProviderProps) {
  const [guides, setGuides] = useState<Guide[]>([]);

  // Load all guides on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getAllUsluge("vodic");
        setGuides(data.items.map(mapUslugaToGuide));
      } catch (err) {
        console.error("Failed to load guides:", err);
      }
    })();
  }, []);

  const addGuide = async (guide: Omit<Guide, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await createUsluga("vodic", mapGuideToRequest(guide));
      const mapped = mapUslugaToGuide(created);
      setGuides(prev => [...prev, { ...mapped, createdAt: getCurrentTimestamp(), updatedAt: getCurrentTimestamp() }]);
    } catch (err) {
      console.error("Failed to add guide:", err);
    }
  };

  const updateGuide = async (id: string, updates: Partial<Guide & { images?: string[] }>) => {
    try {
      const updated = await updateUslugaApi(Number(id), {
        naziv: updates.name,
        komentar: updates.defaultComment,
        pdv_grupa: updates.vatGroup,
      });

      const mappedGuide = mapUslugaToGuide(updated);
    
      setGuides(prev =>
        prev.map(g => g.id === id ? { ...mappedGuide, updatedAt: getCurrentTimestamp() } : g)
      );
    } catch (err) {
      console.error("Failed to update guide:", err);
    }
  };

  const deleteGuide = async (id: string) => {
    try {
      await deleteUslugaApi(Number(id));
      setGuides(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      console.error("Failed to delete guide:", err);
    }
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
  if (!context) throw new Error('useGuides must be used within a GuideProvider');
  return context;
}
