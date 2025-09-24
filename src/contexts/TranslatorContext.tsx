import React, { createContext, useContext, useEffect, useState } from 'react';
import { Translator } from '../types/cms';
import { BaseEntityContext, BaseProviderProps, getCurrentTimestamp } from './base';
import { createUsluga, deleteUslugaApi, getAllUsluge, updateUslugaApi } from '../api/cms';
import { mapTranslatorToRequest, mapUslugaToTranslator } from '../utils/cms_response_mappers';

interface TranslatorContextType extends BaseEntityContext<Translator> {
  translators: Translator[];
  addTranslator: (translator: Omit<Translator, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTranslator: (id: string, translator: Partial<Translator & { images?: string[] }>) => Promise<void>;
  deleteTranslator: (id: string) => Promise<void>;
}

const TranslatorContext = createContext<TranslatorContextType | undefined>(undefined);

export function TranslatorProvider({ children }: BaseProviderProps) {
  const [translators, setTranslators] = useState<Translator[]>([]);

  // Load all translators on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getAllUsluge("prevodilac");
        setTranslators(data.items.map(mapUslugaToTranslator));
      } catch (err) {
        console.error("Failed to load translators:", err);
      }
    })();
  }, []);

  const addTranslator = async (translator: Omit<Translator, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await createUsluga("prevodilac", mapTranslatorToRequest(translator));
      const mapped = mapUslugaToTranslator(created);
      setTranslators(prev => [...prev, { ...mapped, createdAt: getCurrentTimestamp(), updatedAt: getCurrentTimestamp() }]);
    } catch (err) {
      console.error("Failed to add translator:", err);
    }
  };

  const updateTranslator = async (id: string, updates: Partial<Translator & { images?: string[] }>) => {
    try {
      const updated = await updateUslugaApi(Number(id), {
        naziv: updates.name,
        komentar: updates.defaultComment,
        pdv_grupa: updates.vatGroup,
      });

      const mappedTranslator = mapUslugaToTranslator(updated);

      setTranslators(prev =>
        prev.map(t => t.id === id ? { ...mappedTranslator, updatedAt: getCurrentTimestamp() } : t)
      );

    } catch (err) {
      console.error("Failed to update translator:", err);
    }
  };

  const deleteTranslator = async (id: string) => {
    try {
      await deleteUslugaApi(Number(id));
      setTranslators(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Failed to delete translator:", err);
    }
  };

  return (
    <TranslatorContext.Provider value={{
      translators,
      items: translators,
      addTranslator,
      addItem: addTranslator,
      updateTranslator,
      updateItem: updateTranslator,
      deleteTranslator,
      deleteItem: deleteTranslator
    }}>
      {children}
    </TranslatorContext.Provider>
  );
}

export function useTranslators() {
  const context = useContext(TranslatorContext);
  if (!context) throw new Error('useTranslators must be used within a TranslatorProvider');
  return context;
}
