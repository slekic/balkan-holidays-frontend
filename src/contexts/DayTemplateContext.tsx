import React, { createContext, useContext, useState } from 'react';
import { DayTemplate } from '../types/cms';
import { BaseEntityContext, BaseProviderProps, generateId, getCurrentTimestamp } from './base';

interface DayTemplateContextType extends BaseEntityContext<DayTemplate> {
  dayTemplates: DayTemplate[];
  addDayTemplate: (template: Omit<DayTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDayTemplate: (id: string, template: Partial<DayTemplate>) => void;
  deleteDayTemplate: (id: string) => void;
}

const DayTemplateContext = createContext<DayTemplateContextType | undefined>(undefined);

// Mock data
const mockDayTemplates: DayTemplate[] = [
  {
    id: '1',
    title: 'Day 1 - Belgrade City Tour',
    description: 'Comprehensive introduction to Belgrade with major landmarks and cultural sites',
    backgroundImage: 'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    galleryImages: [
      'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/3573383/pexels-photo-3573383.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Day 2 - Cultural Heritage Experience',
    description: 'Deep dive into Serbian culture, traditions, and historical significance',
    backgroundImage: 'https://images.pexels.com/photos/1659439/pexels-photo-1659439.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    galleryImages: [
      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    ],
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  },
  {
    id: '3',
    title: 'Day 3 - Danube Region Exploration',
    description: 'Scenic tour of the Danube region with nature and river activities',
    backgroundImage: 'https://images.pexels.com/photos/1001683/pexels-photo-1001683.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    galleryImages: [
      'https://images.pexels.com/photos/1001684/pexels-photo-1001684.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/1001685/pexels-photo-1001685.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/3573384/pexels-photo-3573384.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    ],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  }
];

export function DayTemplateProvider({ children }: BaseProviderProps) {
  const [dayTemplates, setDayTemplates] = useState<DayTemplate[]>(mockDayTemplates);

  const addDayTemplate = (template: Omit<DayTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: DayTemplate = {
      ...template,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setDayTemplates(prev => [...prev, newTemplate]);
  };

  const updateDayTemplate = (id: string, updates: Partial<DayTemplate>) => {
    setDayTemplates(prev => prev.map(template => 
      template.id === id ? { ...template, ...updates, updatedAt: getCurrentTimestamp() } : template
    ));
  };

  const deleteDayTemplate = (id: string) => {
    setDayTemplates(prev => prev.filter(template => template.id !== id));
  };

  return (
    <DayTemplateContext.Provider value={{
      dayTemplates,
      items: dayTemplates,
      addDayTemplate,
      addItem: addDayTemplate,
      updateDayTemplate,
      updateItem: updateDayTemplate,
      deleteDayTemplate,
      deleteItem: deleteDayTemplate
    }}>
      {children}
    </DayTemplateContext.Provider>
  );
}

export function useDayTemplates() {
  const context = useContext(DayTemplateContext);
  if (context === undefined) {
    throw new Error('useDayTemplates must be used within a DayTemplateProvider');
  }
  return context;
}
