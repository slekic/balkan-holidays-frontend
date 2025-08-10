import {
  Building2,
  UtensilsCrossed,
  Car,
  UserCheck,
  MapPin,
  Gift,
  FileText,
} from "lucide-react";

export const ENTITY_ICONS = {
  hotel: Building2,
  restaurant: UtensilsCrossed,
  transport: Car,
  guide: UserCheck,
  activity: MapPin,
  gift: Gift,
  other: FileText,
} as const;

export const ENTITY_COLORS = {
  hotel: "bg-blue-100 text-blue-800",
  restaurant: "bg-green-100 text-green-800",
  transport: "bg-purple-100 text-purple-800",
  guide: "bg-orange-100 text-orange-800",
  activity: "bg-red-100 text-red-800",
  gift: "bg-pink-100 text-pink-800",
  other: "bg-gray-100 text-gray-800",
} as const;

export const ENTITY_TYPE_LABELS = {
  hotel: "Hotel",
  restaurant: "Restoran",
  transport: "Prevoz",
  guide: "Vodič",
  activity: "Aktivnost",
  gift: "Poklon",
  other: "Ostalo",
} as const;

export const ITEMS_PER_PAGE = 10;

export const MOCK_CLIENTS = [
  "ABC Travel Agency",
  "Global Adventures Inc.",
  "Adventure Seekers Ltd.",
];

export const MOCK_USERS = [
  "Finance Manager",
  "Operations Manager",
  "Admin User",
];

