import { HotelResponse, KlijentResponse, SablonDanaResponse, UslugaResponse } from '../api/responses';
import { Activity, Client, DayTemplate, Gift, Guide, Hotel, Restaurant, Translator, Transport, VATGroup } from '../types/cms';

export const entityTypeMapper: Record<string, string> = {
  activity: "aktivnost",
  restaurant: "restoran",
  gift: "poklon",
  transport: "prevoz",
  hotel: "hotel",       
  guide: "vodic",       
  translator: "prevodilac",
  other: "ostalo"
};

export function mapHotelResponse(apiHotel: HotelResponse): Hotel {
  const vatGroup: VATGroup =
    apiHotel.pdv_grupa === '10%' || apiHotel.pdv_grupa === '20%' || apiHotel.pdv_grupa === 'Article 35'
      ? apiHotel.pdv_grupa
      : '20%';

  return {
    id: apiHotel.id.toString(),   
    name: apiHotel.naziv,
    roomTypes: Object.entries(apiHotel.tipovi_soba).map(([id, name]) => ({
      id: id,      
      name: name
    })),
    websiteLink: apiHotel.link_sajta ?? '',
    description: apiHotel.opis ?? '',
    numberOfRooms: apiHotel.broj_soba ?? 0,
    numberOfRestaurants: apiHotel.broj_restorana ?? 0,
    vatGroup: vatGroup,
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString(), 
    logo: apiHotel.slike && apiHotel.slike.length > 0 
      ? `http://localhost:8000/${apiHotel.slike[0].url}` 
      : undefined
  };
}

export function mapHotelToRequest(
  hotel: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>
): Omit<HotelResponse, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    naziv: hotel.name,
    tipovi_soba: hotel.roomTypes.map(rt => rt.name),
    link_sajta: hotel.websiteLink || undefined,
    opis: hotel.description || undefined,
    broj_soba: hotel.numberOfRooms ?? null,
    broj_restorana: hotel.numberOfRestaurants ?? null,
    pdv_grupa: hotel.vatGroup,
    slike: []
  };
}

export function mapPartialHotelToRequest(
  hotel: Partial<Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>>
): Partial<Omit<HotelResponse, 'id' | 'createdAt' | 'updatedAt'>> {
  return {
    naziv: hotel.name,
    link_sajta: hotel.websiteLink,
    opis: hotel.description,
    broj_soba: hotel.numberOfRooms,
    broj_restorana: hotel.numberOfRestaurants,
    pdv_grupa: hotel.vatGroup,
    tipovi_soba: hotel.roomTypes?.map(r => r.name),
    slike: hotel.logo ? [{ tip: 'logo', url: hotel.logo }] : []
  };
}

export function mapUslugaToRestaurant(apiRestaurant: UslugaResponse): Restaurant {
  return {
    id: apiRestaurant.id.toString(),
    name: apiRestaurant.naziv,
    defaultComment: apiRestaurant.komentar || '',
    websiteLink: apiRestaurant.link_sajta || '',
    description: apiRestaurant.sadrzaj || '',
    vatGroup: mapVATGroup(apiRestaurant.pdv_grupa),
    images: apiRestaurant.slike?.map((s: any) => `http://localhost:8000/${s.url}`) || [],
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString(),
  };
}

export function mapRestaurantToRequest(
  restaurant: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>
): Omit<UslugaResponse, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    naziv: restaurant.name,
    komentar: restaurant.defaultComment,
    link_sajta: restaurant.websiteLink,
    sadrzaj: restaurant.description,
    pdv_grupa: restaurant.vatGroup,
    slike: []
  };
}

export function mapUslugaToTransport(apiTransport: UslugaResponse): Transport {
  return {
    id: apiTransport.id.toString(),
    name: apiTransport.naziv,
    defaultComment: apiTransport.komentar || '',
    vatGroup: mapVATGroup(apiTransport.pdv_grupa),
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString(),
  };
}

export function mapTransportToRequest(transport: Omit<Transport, 'id' | 'createdAt' | 'updatedAt'>
): Omit<UslugaResponse, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    naziv: transport.name,
    komentar: transport.defaultComment,
    pdv_grupa: transport.vatGroup,
    slike: []
  };
}

export function mapUslugaToTranslator(apiTranslator: UslugaResponse): Translator {
  return {
    id: apiTranslator.id.toString(),
    name: apiTranslator.naziv,
    defaultComment: apiTranslator.komentar || '',
    vatGroup: mapVATGroup(apiTranslator.pdv_grupa),
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString(),
  };
}

export function mapTranslatorToRequest(translator: Omit<Translator, 'id' | 'createdAt' | 'updatedAt'>
): Omit<UslugaResponse, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    naziv: translator.name,
    komentar: translator.defaultComment,
    pdv_grupa: translator.vatGroup,
    slike: []
  };
}

export function mapUslugaToGuide(apiGuide: UslugaResponse): Guide {
  return {
    id: apiGuide.id.toString(),
    name: apiGuide.naziv,
    defaultComment: apiGuide.komentar || '',
    vatGroup: mapVATGroup(apiGuide.pdv_grupa),
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString(),
  };
}

export function mapGuideToRequest(guide: Omit<Guide, 'id' | 'createdAt' | 'updatedAt'>
): Omit<UslugaResponse, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    naziv: guide.name,
    komentar: guide.defaultComment,
    pdv_grupa: guide.vatGroup,
    slike: []
  };
}

export function mapUslugaToGift(apiGift: UslugaResponse): Gift {
  return {
    id: apiGift.id.toString(),
    name: apiGift.naziv,
    defaultComment: apiGift.komentar || '',
    description: apiGift.opis || '',
    price: apiGift.cena || 0,
    whatsIncluded: apiGift.sadrzaj || '',
    image: apiGift.slike && apiGift.slike.length > 0 
      ? `http://localhost:8000/${apiGift.slike[0].url}` 
      : undefined,
    vatGroup: mapVATGroup(apiGift.pdv_grupa),
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString(),
  };
}

export function mapGiftToRequest(gift: Omit<Gift, 'id' | 'createdAt' | 'updatedAt'>
): Omit<UslugaResponse, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    naziv: gift.name,
    komentar: gift.defaultComment,
    opis: gift.description,
    cena: gift.price,
    sadrzaj: gift.whatsIncluded,
    pdv_grupa: gift.vatGroup,
    slike: []
  };
}

export function mapUslugaToActivity(apiGift: UslugaResponse): Activity {
  return {
    id: apiGift.id.toString(),
    name: apiGift.naziv,
    defaultComment: apiGift.komentar || '',
    description: apiGift.opis || '',
    backgroundImage: apiGift.slike.find(s => s.tip === 'logo')
      ? `http://localhost:8000/${apiGift.slike.find(s => s.tip === 'logo')!.url}`
      : undefined,
    images: apiGift.slike
      ?.filter(s => s.tip === 'slika')
      .map(s => `http://localhost:8000/${s.url}`) || [],
    vatGroup: mapVATGroup(apiGift.pdv_grupa),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function mapActivityToRequest(gift: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>
): Omit<UslugaResponse, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    naziv: gift.name,
    komentar: gift.defaultComment,
    opis: gift.description,
    slike: [],
    pdv_grupa: gift.vatGroup,
  };
}

export function mapClientToKlijentRequest(client: Omit<Client, "id" | "createdAt" | "updatedAt">) {
  return {
    naziv: client.name,
    pib: client.pib,
  };
}

export function mapKlijentResponseToClient(klijent: KlijentResponse): Client {
  return {
    id: klijent.id.toString(),
    name: klijent.naziv,
    pib: klijent.pib,
    createdAt: klijent.createdAt ? parseDate(klijent.createdAt) : new Date(),
    updatedAt: klijent.updatedAt ? parseDate(klijent.updatedAt) : new Date(),
  };
}

function mapVATGroup(pdv_grupa: string): VATGroup {
  if (pdv_grupa === '10%' || pdv_grupa === '20%' || pdv_grupa === 'Article 35') {
    return pdv_grupa as VATGroup;
  }
  return '20%'; 
}

function parseDate(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

export function mapSablonDanaToDayTemplate(api: SablonDanaResponse): DayTemplate {
  return {
    id: api.id.toString(),
    title: api.naslov,
    description: api.opis || '',
    backgroundImage: api.slike.find(s => s.tip === 'logo') ? `http://localhost:8000/${api.slike.find(s => s.tip === 'logo')!.url}` : undefined,
    galleryImages: api.slike.filter(s => s.tip === 'slika').map(s => `http://localhost:8000/${s.url}`) || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function mapDayTemplateToSablonDanaRequest(template: Omit<DayTemplate, 'id' | 'createdAt' | 'updatedAt'>): Omit<SablonDanaResponse, 'id'> {
  return {
    naslov: template.title,
    opis: template.description,
    slike: [],
  };
}
