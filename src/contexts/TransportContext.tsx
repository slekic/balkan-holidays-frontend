import React, { createContext, useContext, useState } from 'react';
import { Transport } from '../types/cms';
import { BaseEntityContext, BaseProviderProps, generateId, getCurrentTimestamp } from './base';

interface TransportContextType extends BaseEntityContext<Transport> {
  transports: Transport[];
  addTransport: (transport: Omit<Transport, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransport: (id: string, transport: Partial<Transport>) => void;
  deleteTransport: (id: string) => void;
}

const TransportContext = createContext<TransportContextType | undefined>(undefined);

// Mock data
const mockTransports: Transport[] = [
  {
    id: '1',
    name: 'Airport Transfer - Mercedes E-Class',
    defaultComment: 'Luxury airport transfer service',
    vatGroup: '20%',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'City Tour Bus - 50 seats',
    defaultComment: 'Air-conditioned tour bus for group excursions',
    vatGroup: '20%',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  },
  {
    id: '3',
    name: 'Private Van - 8 passengers',
    defaultComment: 'Comfortable van for small group transfers',
    vatGroup: '20%',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  }
];

export function TransportProvider({ children }: BaseProviderProps) {
  const [transports, setTransports] = useState<Transport[]>(mockTransports);

  const addTransport = (transport: Omit<Transport, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransport: Transport = {
      ...transport,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setTransports(prev => [...prev, newTransport]);
  };

  const updateTransport = (id: string, updates: Partial<Transport>) => {
    setTransports(prev => prev.map(transport => 
      transport.id === id ? { ...transport, ...updates, updatedAt: getCurrentTimestamp() } : transport
    ));
  };

  const deleteTransport = (id: string) => {
    setTransports(prev => prev.filter(transport => transport.id !== id));
  };

  return (
    <TransportContext.Provider value={{
      transports,
      items: transports,
      addTransport,
      addItem: addTransport,
      updateTransport,
      updateItem: updateTransport,
      deleteTransport,
      deleteItem: deleteTransport
    }}>
      {children}
    </TransportContext.Provider>
  );
}

export function useTransports() {
  const context = useContext(TransportContext);
  if (context === undefined) {
    throw new Error('useTransports must be used within a TransportProvider');
  }
  return context;
}
