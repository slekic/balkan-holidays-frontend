import React, { createContext, useContext, useState } from 'react';
import { Restaurant } from '../types/cms';
import { BaseEntityContext, BaseProviderProps, generateId, getCurrentTimestamp } from './base';

interface RestaurantContextType extends BaseEntityContext<Restaurant> {
  restaurants: Restaurant[];
  addRestaurant: (restaurant: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRestaurant: (id: string, restaurant: Partial<Restaurant>) => void;
  deleteRestaurant: (id: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

// Mock data
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Restoran Tri Šešira',
    defaultComment: 'Traditional Serbian cuisine',
    websiteLink: 'https://trisesira.rs',
    description: 'Authentic Serbian restaurant in Skadarlija',
    images: [
      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    ],
    vatGroup: '20%',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Manufaktura',
    defaultComment: 'Modern Serbian gastronomy',
    websiteLink: 'https://manufaktura.rs',
    description: 'Contemporary restaurant with traditional Serbian dishes',
    images: [
      'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    ],
    vatGroup: '20%',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-14'
  },
  {
    id: '3',
    name: 'Lorenzo & Kakalamba',
    defaultComment: 'Italian cuisine with Serbian twist',
    websiteLink: 'https://lorenzo-kakalamba.com',
    description: 'Unique fusion restaurant with eclectic decor',
    images: [
      'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      'https://images.pexels.com/photos/1484516/pexels-photo-1484516.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    ],
    vatGroup: '20%',
    createdAt: '2024-01-09',
    updatedAt: '2024-01-11'
  }
];

export function RestaurantProvider({ children }: BaseProviderProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);

  const addRestaurant = (restaurant: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRestaurant: Restaurant = {
      ...restaurant,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setRestaurants(prev => [...prev, newRestaurant]);
  };

  const updateRestaurant = (id: string, updates: Partial<Restaurant>) => {
    setRestaurants(prev => prev.map(restaurant => 
      restaurant.id === id ? { ...restaurant, ...updates, updatedAt: getCurrentTimestamp() } : restaurant
    ));
  };

  const deleteRestaurant = (id: string) => {
    setRestaurants(prev => prev.filter(restaurant => restaurant.id !== id));
  };

  return (
    <RestaurantContext.Provider value={{
      restaurants,
      items: restaurants,
      addRestaurant,
      addItem: addRestaurant,
      updateRestaurant,
      updateItem: updateRestaurant,
      deleteRestaurant,
      deleteItem: deleteRestaurant
    }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurants() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurants must be used within a RestaurantProvider');
  }
  return context;
}
