export interface OfferFormData {
  // General Information
  offerName: string;
  offerCode: string;
  clientId: string;
  location: string;
  numberOfPersons: number;
  startDate: string;
  endDate: string;
  option: string;
  numberOfDays: number;
  
  // Accommodation
  accommodationEnabled: boolean;
  hotels: HotelEntry[];
  
  // Land Services
  landServicesEnabled: boolean;
  landServices: DayService[];
  
  // Totals
  totalPrice: number;
  pricePerPerson: number;
}

export interface DayService {
  id: string;
  date: string;
  dayTitle: string;
  services: ServiceEntry[];
  subtotal: number;
}

export interface ServiceEntry {
  id: string;
  serviceType: 'activity' | 'restaurant' | 'guide' | 'translator' | 'transport' | 'gift';
  serviceId: string;
  quantityPersons: number;
  quantityDays: number;
  pricePerDayPerPerson: number;
  comment: string;
  subtotal: number;
}

export interface HotelEntry {
  id: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomTypes: RoomTypeEntry[];
  cityTax: {
    pricePerPersonPerDay: number;
    comment: string;
  };
  subtotal: number;
}

export interface RoomTypeEntry {
  id: string;
  roomTypeId: string;
  numberOfPersons: number;
  pricePerNightPerPerson: number;
  comment: string;
  totalCost: number;
}

export interface NewClientFormData {
  name: string;
  pib: string;
}

export interface ExpenseEntry {
  id: string;
  entityType: 'hotel' | 'restaurant' | 'activity' | 'guide' | 'translator' | 'transport' | 'gift' | 'other';
  entityId?: string;
  entityName: string;
  costAmount: number;
  comment: string;
  uploadedFile?: File;
}

export interface OfferExpenses {
  offerId: string;
  expenses: ExpenseEntry[];
  totalExpenses: number;
  createdAt: string;
  updatedAt: string;
}