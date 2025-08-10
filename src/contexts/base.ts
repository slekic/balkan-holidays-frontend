import { ReactNode } from 'react';

// Common utility functions
export const generateId = () => Date.now().toString();
export const getCurrentTimestamp = () => new Date().toISOString();

// Common context interface for all entities
export interface BaseEntityContext<T> {
  items: T[];
  addItem: (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, item: Partial<T>) => void;
  deleteItem: (id: string) => void;
}

// Common provider props
export interface BaseProviderProps {
  children: ReactNode;
}
