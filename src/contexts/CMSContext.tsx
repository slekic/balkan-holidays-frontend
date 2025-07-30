import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Hotel, Restaurant, Transport, Translator, Guide, Activity, Gift, Client, DayTemplate, VATGroup } from '../types/cms';

interface CMSContextType {
  // Hotels
  hotels: Hotel[];
  addHotel: (hotel: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateHotel: (id: string, hotel: Partial<Hotel>) => void;
  deleteHotel: (id: string) => void;
  
  // Restaurants
  restaurants: Restaurant[];
  addRestaurant: (restaurant: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRestaurant: (id: string, restaurant: Partial<Restaurant>) => void;
  deleteRestaurant: (id: string) => void;
  
  // Transport
  transports: Transport[];
  addTransport: (transport: Omit<Transport, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransport: (id: string, transport: Partial<Transport>) => void;
  deleteTransport: (id: string) => void;
  
  // Translators
  translators: Translator[];
  addTranslator: (translator: Omit<Translator, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTranslator: (id: string, translator: Partial<Translator>) => void;
  deleteTranslator: (id: string) => void;
  
  // Guides
  guides: Guide[];
  addGuide: (guide: Omit<Guide, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGuide: (id: string, guide: Partial<Guide>) => void;
  deleteGuide: (id: string) => void;
  
  // Activities
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateActivity: (id: string, activity: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  
  // Gifts
  gifts: Gift[];
  addGift: (gift: Omit<Gift, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGift: (id: string, gift: Partial<Gift>) => void;
  deleteGift: (id: string) => void;
  
  // Clients
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  // Day Templates
  dayTemplates: DayTemplate[];
  addDayTemplate: (template: Omit<DayTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDayTemplate: (id: string, template: Partial<DayTemplate>) => void;
  deleteDayTemplate: (id: string) => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

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

const mockTranslators: Translator[] = [
  {
    id: '1',
    name: 'English Translator - Ana Petrović',
    defaultComment: 'Professional English interpreter',
    vatGroup: 'Article 35',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'German Translator - Marko Jovanović',
    defaultComment: 'Certified German language interpreter',
    vatGroup: 'Article 35',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  },
  {
    id: '3',
    name: 'French Translator - Milica Stojanović',
    defaultComment: 'Native French speaker with tourism experience',
    vatGroup: 'Article 35',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08'
  }
];

const mockGuides: Guide[] = [
  {
    id: '1',
    name: 'Belgrade City Guide - Stefan Nikolić',
    defaultComment: 'Expert local guide for Belgrade tours',
    vatGroup: 'Article 35',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Dinner Assistance Guide',
    defaultComment: 'Restaurant coordination and cultural explanation',
    vatGroup: 'Article 35',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  },
  {
    id: '3',
    name: 'Museum Guide - Art History',
    defaultComment: 'Specialized guide for museums and galleries',
    vatGroup: 'Article 35',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  }
];

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

const mockGifts: Gift[] = [
  {
    id: '1',
    name: 'Welcome Gift Package',
    defaultComment: 'Traditional Serbian welcome gifts',
    description: 'Authentic Serbian souvenirs and local delicacies',
    price: 25.00,
    whatsIncluded: 'Serbian honey, rakija miniature, traditional handicraft, welcome card',
    image: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    vatGroup: '20%',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Premium Souvenir Set',
    defaultComment: 'High-quality Serbian crafts collection',
    description: 'Carefully selected premium souvenirs representing Serbian culture',
    price: 45.00,
    whatsIncluded: 'Handmade pottery, traditional textile, premium rakija, Serbian cookbook',
    image: 'https://images.pexels.com/photos/1303082/pexels-photo-1303082.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    vatGroup: '20%',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  },
  {
    id: '3',
    name: 'Corporate Gift Box',
    defaultComment: 'Business-appropriate Serbian gifts',
    description: 'Professional gift set suitable for corporate clients',
    price: 35.00,
    whatsIncluded: 'Serbian wine, branded notebook, traditional pen, company brochure',
    image: 'https://images.pexels.com/photos/1303083/pexels-photo-1303083.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    vatGroup: '20%',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  }
];

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

export function CMSProvider({ children }: { children: ReactNode }) {
  const [hotels, setHotels] = useState<Hotel[]>(mockHotels);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [transports, setTransports] = useState<Transport[]>(mockTransports);
  const [translators, setTranslators] = useState<Translator[]>(mockTranslators);
  const [guides, setGuides] = useState<Guide[]>(mockGuides);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [gifts, setGifts] = useState<Gift[]>(mockGifts);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [dayTemplates, setDayTemplates] = useState<DayTemplate[]>(mockDayTemplates);

  const generateId = () => Date.now().toString();
  const getCurrentTimestamp = () => new Date().toISOString();

  // Hotel methods
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

  // Restaurant methods
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

  // Transport methods
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

  // Translator methods
  const addTranslator = (translator: Omit<Translator, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTranslator: Translator = {
      ...translator,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setTranslators(prev => [...prev, newTranslator]);
  };

  const updateTranslator = (id: string, updates: Partial<Translator>) => {
    setTranslators(prev => prev.map(translator => 
      translator.id === id ? { ...translator, ...updates, updatedAt: getCurrentTimestamp() } : translator
    ));
  };

  const deleteTranslator = (id: string) => {
    setTranslators(prev => prev.filter(translator => translator.id !== id));
  };

  // Guide methods
  const addGuide = (guide: Omit<Guide, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGuide: Guide = {
      ...guide,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setGuides(prev => [...prev, newGuide]);
  };

  const updateGuide = (id: string, updates: Partial<Guide>) => {
    setGuides(prev => prev.map(guide => 
      guide.id === id ? { ...guide, ...updates, updatedAt: getCurrentTimestamp() } : guide
    ));
  };

  const deleteGuide = (id: string) => {
    setGuides(prev => prev.filter(guide => guide.id !== id));
  };

  // Activity methods
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

  // Gift methods
  const addGift = (gift: Omit<Gift, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGift: Gift = {
      ...gift,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setGifts(prev => [...prev, newGift]);
  };

  const updateGift = (id: string, updates: Partial<Gift>) => {
    setGifts(prev => prev.map(gift => 
      gift.id === id ? { ...gift, ...updates, updatedAt: getCurrentTimestamp() } : gift
    ));
  };

  const deleteGift = (id: string) => {
    setGifts(prev => prev.filter(gift => gift.id !== id));
  };

  // Client methods
  const addClient = (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClient: Client = {
      ...client,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(client => 
      client.id === id ? { ...client, ...updates, updatedAt: getCurrentTimestamp() } : client
    ));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  // Modified addClient to return the created client
  const addClientWithReturn = (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client => {
    const newClient: Client = {
      ...client,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  // Day Template methods
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
    <CMSContext.Provider value={{
      hotels, addHotel, updateHotel, deleteHotel,
      restaurants, addRestaurant, updateRestaurant, deleteRestaurant,
      transports, addTransport, updateTransport, deleteTransport,
      translators, addTranslator, updateTranslator, deleteTranslator,
      guides, addGuide, updateGuide, deleteGuide,
      activities, addActivity, updateActivity, deleteActivity,
      gifts, addGift, updateGift, deleteGift,
      clients, addClient: addClientWithReturn, updateClient, deleteClient,
      dayTemplates, addDayTemplate, updateDayTemplate, deleteDayTemplate
    }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}