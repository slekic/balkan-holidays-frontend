import React, { createContext, useContext, useState } from 'react';
import { Hotel } from '../types/cms';
import { BaseEntityContext, BaseProviderProps, generateId, getCurrentTimestamp } from './base';

interface HotelContextType extends BaseEntityContext<Hotel> {
  hotels: Hotel[];
  addHotel: (hotel: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateHotel: (id: string, hotel: Partial<Hotel>) => void;
  deleteHotel: (id: string) => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

// Mock data
const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Hotel Metropol Palace',
    roomTypes: [
      { id: '1', name: 'Standard Double' },
      { id: '2', name: 'Deluxe Suite' }
    ],
    websiteLink: 'https://metropolpalace.com',
    logo: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    description: 'Luxury hotel in the heart of Belgrade',
    numberOfRooms: 236,
    numberOfRestaurants: 3,
    vatGroup: '20%',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Hotel Square Nine',
    roomTypes: [
      { id: '3', name: 'Superior Room' },
      { id: '4', name: 'Executive Suite' },
      { id: '5', name: 'Presidential Suite' }
    ],
    websiteLink: 'https://squarenine.rs',
    logo: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    description: 'Boutique luxury hotel with modern amenities',
    numberOfRooms: 45,
    numberOfRestaurants: 1,
    vatGroup: '20%',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12'
  },
  {
    id: '3',
    name: 'Hyatt Regency Belgrade',
    roomTypes: [
      { id: '6', name: 'Standard King' },
      { id: '7', name: 'Twin Room' },
      { id: '8', name: 'Regency Suite' }
    ],
    websiteLink: 'https://hyatt.com/belgrade',
    logo: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    description: 'International luxury hotel with conference facilities',
    numberOfRooms: 302,
    numberOfRestaurants: 2,
    vatGroup: '20%',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08'
  }
];

export function HotelProvider({ children }: BaseProviderProps) {
  const [hotels, setHotels] = useState<Hotel[]>(mockHotels);

  const addHotel = (hotel: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newHotel: Hotel = {
      ...hotel,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setHotels(prev => [...prev, newHotel]);
  };

  const updateHotel = (id: string, updates: Partial<Hotel>) => {
    setHotels(prev => prev.map(hotel => 
      hotel.id === id ? { ...hotel, ...updates, updatedAt: getCurrentTimestamp() } : hotel
    ));
  };

  const deleteHotel = (id: string) => {
    setHotels(prev => prev.filter(hotel => hotel.id !== id));
  };

  return (
    <HotelContext.Provider value={{
      hotels,
      items: hotels,
      addHotel,
      addItem: addHotel,
      updateHotel,
      updateItem: updateHotel,
      deleteHotel,
      deleteItem: deleteHotel
    }}>
      {children}
    </HotelContext.Provider>
  );
}

export function useHotels() {
  const context = useContext(HotelContext);
  if (context === undefined) {
    throw new Error('useHotels must be used within a HotelProvider');
  }
  return context;
}
