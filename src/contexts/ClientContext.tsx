import React, { createContext, useContext, useState } from 'react';
import { Client } from '../types/cms';
import { BaseEntityContext, BaseProviderProps, generateId, getCurrentTimestamp } from './base';

interface ClientContextType extends BaseEntityContext<Client> {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Client;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

// Mock data
const mockClients: Client[] = [
  {
    id: '1',
    name: 'ABC Travel Agency',
    pib: '123456789',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'European Tours Ltd.',
    pib: '987654321',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  },
  {
    id: '3',
    name: 'Global Adventures Inc.',
    pib: '456789123',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  }
];

export function ClientProvider({ children }: BaseProviderProps) {
  const [clients, setClients] = useState<Client[]>(mockClients);

  const addClient = (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client => {
    const newClient: Client = {
      ...client,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(client => 
      client.id === id ? { ...client, ...updates, updatedAt: getCurrentTimestamp() } : client
    ));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  return (
    <ClientContext.Provider value={{
      clients,
      items: clients,
      addClient,
      addItem: addClient,
      updateClient,
      updateItem: updateClient,
      deleteClient,
      deleteItem: deleteClient
    }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
}
