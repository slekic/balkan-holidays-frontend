export interface Offer {
  id: string;
  name: string;
  code: string;
  client: string;
  numberOfPersons: number;
  startDate: string;
  endDate: string;
  days: number;
  totalPrice: number;
  status: "Sent" | "Accepted" | "Rejected" | "Finished";
  createdAt: string;
  createdBy: string;
  entities: string[];
  deletedAt: string;
  deletedBy: string;
  lastUpdated: string;
  daysSinceUpdate: number;
}

export interface OfferFilters {
  client: string;
  entity: string;
  createdBy: string;
  status: string;
  personsMin: string;
  personsMax: string;
  priceMin: string;
  priceMax: string;
  dateFrom: string;
  dateTo: string;
}

export interface Accommodation {
  hotelId: number;
  hotelName?: string; 
  roomTypeId: number;
  roomTypeName?: string;
  numberOfPersons: number;
  startDate: string; 
  endDate: string;  
  touristTax: number;
  pricePerDay: number;
  comment?: string;
}

export interface DailyService {
  date: string;
  dayName: string;
  serviceId: number;
  serviceName: string;
  serviceType: string;
  numberOfPersons: number;
  numberOfDays: number;
  pricePerDayPerPerson: number;
  comment?: string;
}

export interface OfferDetailed {
  id: number;
  code: string;
  name: string;
  userId: number;
  clientId: number;
  location?: string;
  numberOfPersons?: number;
  startDate: string; 
  endDate: string;  
  description?: string;
  status: string;
  includesAccommodation: boolean;
  includesDailyServices: boolean;
  accommodation: Accommodation[];
  dailyServices: DailyService[];
}




