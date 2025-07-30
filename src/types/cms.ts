export interface Hotel {
  id: string;
  name: string;
  roomTypes: RoomType[];
  websiteLink: string;
  logo?: string;
  description: string;
  numberOfRooms: number;
  numberOfRestaurants: number;
  vatGroup: VATGroup;
  createdAt: string;
  updatedAt: string;
}

export interface RoomType {
  id: string;
  name: string;
}

export interface Restaurant {
  id: string;
  name: string;
  defaultComment: string;
  websiteLink: string;
  description: string;
  images: string[];
  vatGroup: VATGroup;
  createdAt: string;
  updatedAt: string;
}

export interface Transport {
  id: string;
  name: string;
  defaultComment: string;
  vatGroup: VATGroup;
  createdAt: string;
  updatedAt: string;
}

export interface Translator {
  id: string;
  name: string;
  defaultComment: string;
  vatGroup: VATGroup;
  createdAt: string;
  updatedAt: string;
}

export interface Guide {
  id: string;
  name: string;
  defaultComment: string;
  vatGroup: VATGroup;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  name: string;
  defaultComment: string;
  description: string;
  backgroundImage?: string;
  images: string[];
  vatGroup: VATGroup;
  createdAt: string;
  updatedAt: string;
}

export interface Gift {
  id: string;
  name: string;
  defaultComment: string;
  description?: string;
  price: number;
  whatsIncluded: string;
  image?: string;
  vatGroup: VATGroup;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  pib: string;
  createdAt: string;
  updatedAt: string;
}

export interface DayTemplate {
  id: string;
  title: string;
  description: string;
  backgroundImage?: string;
  galleryImages: string[];
  createdAt: string;
  updatedAt: string;
}

export type VATGroup = '10%' | '20%' | 'Article 35';

export type CMSEntity = Hotel | Restaurant | Transport | Translator | Guide | Activity | Gift | Client | DayTemplate;