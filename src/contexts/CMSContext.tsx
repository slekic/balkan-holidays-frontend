// This file is maintained for backward compatibility
// New code should use the individual contexts from their respective files

export { CMSProvider } from './CMSProvider';
export { 
  useHotels, 
  useRestaurants, 
  useTransports, 
  useTranslators, 
  useGuides, 
  useActivities, 
  useGifts, 
  useClients, 
  useDayTemplates 
} from './index';

// Legacy useCMS hook that provides access to all contexts
// Note: This is deprecated and should be replaced with individual hooks
import { useContext } from 'react';
import { 
  useHotels, 
  useRestaurants, 
  useTransports, 
  useTranslators, 
  useGuides, 
  useActivities, 
  useGifts, 
  useClients, 
  useDayTemplates 
} from './index';

export function useCMS() {
  const hotels = useHotels();
  const restaurants = useRestaurants();
  const transports = useTransports();
  const translators = useTranslators();
  const guides = useGuides();
  const activities = useActivities();
  const gifts = useGifts();
  const clients = useClients();
  const dayTemplates = useDayTemplates();

  return {
    // Hotels
    hotels: hotels.hotels,
    addHotel: hotels.addHotel,
    updateHotel: hotels.updateHotel,
    deleteHotel: hotels.deleteHotel,
    
    // Restaurants
    restaurants: restaurants.restaurants,
    addRestaurant: restaurants.addRestaurant,
    updateRestaurant: restaurants.updateRestaurant,
    deleteRestaurant: restaurants.deleteRestaurant,
    
    // Transport
    transports: transports.transports,
    addTransport: transports.addTransport,
    updateTransport: transports.updateTransport,
    deleteTransport: transports.deleteTransport,
    
    // Translators
    translators: translators.translators,
    addTranslator: translators.addTranslator,
    updateTranslator: translators.updateTranslator,
    deleteTranslator: translators.deleteTranslator,
    
    // Guides
    guides: guides.guides,
    addGuide: guides.addGuide,
    updateGuide: guides.updateGuide,
    deleteGuide: guides.deleteGuide,
    
    // Activities
    activities: activities.activities,
    addActivity: activities.addActivity,
    updateActivity: activities.updateActivity,
    deleteActivity: activities.deleteActivity,
    
    // Gifts
    gifts: gifts.gifts,
    addGift: gifts.addGift,
    updateGift: gifts.updateGift,
    deleteGift: gifts.deleteGift,
    
    // Clients
    clients: clients.clients,
    addClient: clients.addClient,
    updateClient: clients.updateClient,
    deleteClient: clients.deleteClient,
    
    // Day Templates
    dayTemplates: dayTemplates.dayTemplates,
    addDayTemplate: dayTemplates.addDayTemplate,
    updateDayTemplate: dayTemplates.updateDayTemplate,
    deleteDayTemplate: dayTemplates.deleteDayTemplate
  };
}