import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client } from '../types/cms';
import { BaseEntityContext, BaseProviderProps } from './base';
import { createClient, deleteClientApi, fetchClients, updateClientApi } from '../api/cms';
import { mapClientToKlijentRequest, mapKlijentResponseToClient } from '../utils/cms_response_mappers';

interface ClientContextType extends BaseEntityContext<Client> {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Client>;
  addExClient: (client: Client) => void;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: BaseProviderProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await fetchClients();
      const mapped = data.items.map(mapKlijentResponseToClient);
      setClients(mapped);
    } catch (err) {
      console.error("Failed to load clients", err);
    } finally {
      setLoading(false);
    }
  };

  // Calls backend and adds the returned client to state
  const addClient = async (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const res = await createClient(mapClientToKlijentRequest(client));
    const mapped = mapKlijentResponseToClient(res);
    setClients(prev => [...prev, mapped]);
    return mapped;
  };

  // Adds a client directly to the state without backend call
  const addExClient = (client: Client) => {
    setClients(prev => [...prev, client]);
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    const payload: { 
      naziv?: string; 
      pib?: string; 
      adresa?: string; 
      broj_racuna?: string; 
      banka?: number 
    } = {};

    if (updates.name !== undefined) payload.naziv = updates.name;
    if (updates.pib !== undefined) payload.pib = updates.pib;
    if (updates.address !== undefined) payload.adresa = updates.address;
    if (updates.bill !== undefined) payload.broj_racuna = updates.bill;
    if (updates.bank !== undefined) payload.banka = Number(updates.bank);

    const updated = await updateClientApi(Number(id), payload);
    const mappedClient = mapKlijentResponseToClient(updated);

    setClients(prev => prev.map(c => (c.id === id ? mappedClient : c)));
  };

  const deleteClient = async (id: string) => {
    await deleteClientApi(Number(id));
    setClients(prev => prev.filter(c => c.id !== id));
  };

  return (
    <ClientContext.Provider value={{
      clients,
      items: clients,
      addClient,
      addItem: addClient,
      addExClient,
      updateClient,
      updateItem: updateClient,
      deleteClient,
      deleteItem: deleteClient,
    }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientContext);
  if (!context) throw new Error('useClients must be used within a ClientProvider');
  return context;
}
