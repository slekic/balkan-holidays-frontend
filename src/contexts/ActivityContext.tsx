import React, { createContext, useContext, useState } from 'react';
import { Activity } from '../types/cms';
import { BaseEntityContext, BaseProviderProps, generateId, getCurrentTimestamp } from './base';

interface ActivityContextType extends BaseEntityContext<Activity> {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateActivity: (id: string, activity: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

// Mock data
const mockActivities: Activity[] = [
  {
    id: '1',
    name: 'Saint Sava Temple - Entrance Tickets',
    defaultComment: 'Guided tour of the largest Orthodox church',
    description: 'Visit the magnificent Saint Sava Temple, one of the largest Orthodox churches in the world',
    backgroundImage: 'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    images: [
      'https://images.pexels.com/photos/3573383/pexels-photo-3573383.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/3573384/pexels-photo-3573384.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/3573385/pexels-photo-3573385.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    ],
    vatGroup: '10%',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Belgrade Fortress Tour',
    defaultComment: 'Historical fortress with panoramic views',
    description: 'Explore the ancient Belgrade Fortress and enjoy stunning views of the Danube and Sava rivers',
    backgroundImage: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    images: [
      'https://images.pexels.com/photos/1659439/pexels-photo-1659439.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/1659440/pexels-photo-1659440.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    ],
    vatGroup: '10%',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  },
  {
    id: '3',
    name: 'Danube River Cruise',
    defaultComment: 'Scenic boat tour along the Danube',
    description: 'Relaxing cruise along the Danube River with traditional Serbian music and refreshments',
    backgroundImage: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    images: [
      'https://images.pexels.com/photos/1001683/pexels-photo-1001683.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/1001684/pexels-photo-1001684.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/1001685/pexels-photo-1001685.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    ],
    vatGroup: '20%',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  }
];

export function ActivityProvider({ children }: BaseProviderProps) {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);

  const addActivity = (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newActivity: Activity = {
      ...activity,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id ? { ...activity, ...updates, updatedAt: getCurrentTimestamp() } : activity
    ));
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  return (
    <ActivityContext.Provider value={{
      activities,
      items: activities,
      addActivity,
      addItem: addActivity,
      updateActivity,
      updateItem: updateActivity,
      deleteActivity,
      deleteItem: deleteActivity
    }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivities() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivities must be used within a ActivityProvider');
  }
  return context;
}
