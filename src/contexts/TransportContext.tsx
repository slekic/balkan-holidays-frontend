import React, { createContext, useContext, useEffect, useState } from 'react';
import { Transport } from '../types/cms';
import { BaseEntityContext, BaseProviderProps, getCurrentTimestamp } from './base';
import { createUsluga, deleteUslugaApi, getAllUsluge, updateUslugaApi } from '../api/cms';
import { mapTransportToRequest, mapUslugaToTransport } from '../utils/cms_response_mappers';

interface TransportContextType extends BaseEntityContext<Transport> {
  transports: Transport[];
  addTransport: (transport: Omit<Transport, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransport: (id: string, transport: Partial<Transport & { images?: string[] }>) => Promise<void>;
  deleteTransport: (id: string) => Promise<void>;
}

const TransportContext = createContext<TransportContextType | undefined>(undefined);

export function TransportProvider({ children }: BaseProviderProps) {
  const [transports, setTransports] = useState<Transport[]>([]);

  // Load all transports on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getAllUsluge("prevoz");
        setTransports(data.items.map(mapUslugaToTransport));
      } catch (err) {
        console.error("Failed to load transports:", err);
      }
    })();
  }, []);

  const addTransport = async (transport: Omit<Transport, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await createUsluga("prevoz", mapTransportToRequest(transport));
      const mapped = mapUslugaToTransport(created);
      setTransports(prev => [...prev, { ...mapped, createdAt: getCurrentTimestamp(), updatedAt: getCurrentTimestamp() }]);
    } catch (err) {
      console.error("Failed to add transport:", err);
    }
  };

  const updateTransport = async (id: string, updates: Partial<Transport & { images?: string[] }>) => {
    try {
      const updated = await updateUslugaApi(Number(id), {
        naziv: updates.name,
        komentar: updates.defaultComment,
        pdv_grupa: updates.vatGroup,
      });

      const mappedTransport = mapUslugaToTransport(updated);

      setTransports(prev =>
        prev.map(t => t.id === id ? { ...mappedTransport, updatedAt: getCurrentTimestamp() } : t)
      );

    } catch (err) {
      console.error("Failed to update transport:", err);
    }
  };

  const deleteTransport = async (id: string) => {
    try {
      await deleteUslugaApi(Number(id));
      setTransports(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Failed to delete transport:", err);
    }
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
