import {
  Calendar,
  Building2,
  UtensilsCrossed,
  Gift as GiftIcon,
  Info,
  Type,
} from "lucide-react";

export type SlideType =
  | "general"
  | "what-to-expect"
  | "day"
  | "hotel"
  | "restaurant"
  | "gift";

export interface Slide {
  id: string;
  type: SlideType;
  title: string;
  content: any;
}

export const slideTypeIcons = {
  general: Type,
  "what-to-expect": Info,
  day: Calendar,
  hotel: Building2,
  restaurant: UtensilsCrossed,
  gift: GiftIcon,
} as const;

export const slideTypeLabels: Record<SlideType, string> = {
  general: "Opšti slajd",
  "what-to-expect": "Šta da očekujete",
  day: "Dnevni slajd",
  hotel: "Hotel slajd",
  restaurant: "Restoran slajd",
  gift: "Poklon slajd",
};

export const getEntityTypeColor = (entityType: string) => {
  const colors = {
    hotel: "bg-blue-100 text-blue-800",
    activity: "bg-green-100 text-green-800",
    restaurant: "bg-orange-100 text-orange-800",
    guide: "bg-purple-100 text-purple-800",
    translator: "bg-pink-100 text-pink-800",
    transport: "bg-yellow-100 text-yellow-800",
    gift: "bg-red-100 text-red-800",
    other: "bg-gray-100 text-gray-800",
  } as const;
  return (colors as any)[entityType] || colors.other;
};

export const getServiceTypeName = (serviceType: string) => {
  const names = {
    activity: "Activity",
    restaurant: "Restaurant",
    guide: "Guide",
    translator: "Translator",
    transport: "Transport",
    gift: "Gift",
  } as const;
  return (names as any)[serviceType] || serviceType;
};


