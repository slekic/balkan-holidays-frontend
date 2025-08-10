import React, { createContext, useContext, useState } from 'react';
import { Translator } from '../types/cms';
import { BaseEntityContext, BaseProviderProps, generateId, getCurrentTimestamp } from './base';

interface TranslatorContextType extends BaseEntityContext<Translator> {
  translators: Translator[];
  addTranslator: (translator: Omit<Translator, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTranslator: (id: string, translator: Partial<Translator>) => void;
  deleteTranslator: (id: string) => void;
}

const TranslatorContext = createContext<TranslatorContextType | undefined>(undefined);

// Mock data
const mockTranslators: Translator[] = [
  {
    id: '1',
    name: 'English Translator - Ana Petrović',
    defaultComment: 'Professional English interpreter',
    vatGroup: 'Article 35',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'German Translator - Marko Jovanović',
    defaultComment: 'Certified German language interpreter',
    vatGroup: 'Article 35',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  },
  {
    id: '3',
    name: 'French Translator - Milica Stojanović',
    defaultComment: 'Native French speaker with tourism experience',
    vatGroup: 'Article 35',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08'
  }
];

export function TranslatorProvider({ children }: BaseProviderProps) {
  const [translators, setTranslators] = useState<Translator[]>(mockTranslators);

  const addTranslator = (translator: Omit<Translator, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTranslator: Translator = {
      ...translator,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setTranslators(prev => [...prev, newTranslator]);
  };

  const updateTranslator = (id: string, updates: Partial<Translator>) => {
    setTranslators(prev => prev.map(translator => 
      translator.id === id ? { ...translator, ...updates, updatedAt: getCurrentTimestamp() } : translator
    ));
  };

  const deleteTranslator = (id: string) => {
    setTranslators(prev => prev.filter(translator => translator.id !== id));
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
  if (context === undefined) {
    throw new Error('useTranslators must be used within a TranslatorProvider');
  }
  return context;
}
