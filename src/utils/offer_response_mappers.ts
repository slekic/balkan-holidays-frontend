import { AccommodationResponse, DailyServiceResponse, OfferResponse, PonudaAllResponse, SlajdResponse, SlikeResponse } from "../api/responses";
import { Accommodation, DailyService, Offer, OfferDetailed } from "../pages/Archive/AllOffers/types";
import { FollowUpOffer } from "../pages/Archive/FollowUpOffers/types";
import { DeletedOffer } from "../pages/Archive/Trash/types";
import { Slide, SlideType } from "../pages/OfferCreation/utils/constants";
import { generateId } from "../pages/OfferCreation/utils/id";
import { DayService, HotelEntry, OfferFormData, ServiceEntry } from "../types/offer";

export const STATUS_MAP_RES_REQ: Record<string, string> = {
  "Poslato": "Sent",
  "Prihvaćeno": "Accepted",
  "Odbijeno": "Rejected",
  "Završeno": "Finished",
};

export function mapPonudaToOffer(apiPonuda: PonudaAllResponse): Offer | DeletedOffer | FollowUpOffer {
  const today = new Date();
  const updatedDate = apiPonuda.azurirano ? new Date(apiPonuda.azurirano) : null;

  const daysSinceUpdate: number = updatedDate
    ? Math.floor((today.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0; 

  return {
    id: apiPonuda.id.toString(),
    name: apiPonuda.naziv,
    code: apiPonuda.sifra,
    client: apiPonuda.klijent,
    numberOfPersons: apiPonuda.broj_osoba,
    startDate: apiPonuda.datum_od,
    endDate: apiPonuda.datum_do,
    days: apiPonuda.broj_dana,
    totalPrice: apiPonuda.ukupna_cena,
    status: STATUS_MAP_RES_REQ[apiPonuda.status] as Offer["status"],
    createdAt: apiPonuda.kreirano,
    createdBy: apiPonuda.kreirao,
    deletedAt: apiPonuda.azurirano,
    deletedBy: apiPonuda.azurirao,
    lastUpdated: apiPonuda.azurirano,
    daysSinceUpdate, 
    entities: apiPonuda.entiteti,
  };
}

export function mapAccommodation(apiData: AccommodationResponse): Accommodation {
  return {
    hotelId: apiData.hotel_id,
    hotelName: apiData.hotel_naziv,
    roomTypeId: apiData.tip_sobe,
    roomTypeName: apiData.tip_sobe_naziv,
    numberOfPersons: apiData.broj_osoba,
    startDate: apiData.datum_od,
    endDate: apiData.datum_do,
    touristTax: apiData.boravisna_taksa,
    pricePerDay: apiData.cena_po_danu,
    comment: apiData.komentar,
  };
}

export function mapDailyService(apiData: DailyServiceResponse): DailyService {
  return {
    date: apiData.datum,
    dayName: apiData.naziv_dana,
    serviceId: apiData.usluga_id,
    serviceName: apiData.usluga_naziv,
    serviceType: apiData.tip_usluge,
    numberOfPersons: apiData.broj_osoba,
    numberOfDays: apiData.broj_dana,
    pricePerDayPerPerson: apiData.cena_po_danu_po_osobi,
    comment: apiData.komentar,
  };
}

export function mapOffer(apiData: OfferResponse): OfferDetailed {
  return {
    id: apiData.id,
    code: apiData.sifra,
    name: apiData.naziv,
    userId: apiData.korisnik_id,
    clientId: apiData.klijent_id,
    location: apiData.lokacija,
    numberOfPersons: apiData.broj_osoba,
    startDate: apiData.datum_od,
    endDate: apiData.datum_do,
    description: apiData.opis,
    status: apiData.status,
    pricePerPerson: apiData.cena_po_osobi,
    pricePerPersonVat: apiData.cena_po_osobi_pdv,
    includesAccommodation: apiData.ukljucuje_smestaj,
    includesDailyServices: apiData.ukljucuje_usluge,
    accommodation: (apiData.smestaj || []).map(mapAccommodation),
    dailyServices: (apiData.usluge_po_danu || []).map(mapDailyService),
    last_known_updated_at: apiData.last_known_updated_at
  };
}

export function groupAccommodation(accommodation: OfferDetailed["accommodation"]) {
  const grouped: Record<string, Record<string, typeof accommodation>> = {};

  accommodation
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .forEach((room) => {
      const dateKey = `${room.startDate} - ${room.endDate}`;
      if (!grouped[dateKey]) grouped[dateKey] = {};

      if (room.hotelName) {
        if (!grouped[dateKey][room.hotelName]) grouped[dateKey][room.hotelName] = [];
        grouped[dateKey][room.hotelName].push(room);
      }
    });

  return grouped;
}

export function groupServices(dailyServices: OfferDetailed["dailyServices"]) {
  const grouped: Record<string, typeof dailyServices> = {};

  dailyServices
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach((service) => {
      if (!grouped[service.date]) grouped[service.date] = [];
      grouped[service.date].push(service);
    });

  return grouped;
}

export function mapOfferToForm(offer: OfferDetailed): OfferFormData {
  const nights =
    offer.startDate && offer.endDate
      ? (new Date(offer.endDate).getTime() - new Date(offer.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
      : 1;

  const hotelMap: Record<string, HotelEntry> = {};

  (offer.accommodation ?? []).forEach((a) => {
    const key = `${a.hotelId}-${a.startDate}-${a.endDate}`;
    if (!hotelMap[key]) {
      const nights =
        (new Date(a.endDate).getTime() - new Date(a.startDate).getTime()) /
        (1000 * 60 * 60 * 24);

      hotelMap[key] = {
        id: generateId(),
        hotelId: String(a.hotelId),
        checkIn: a.startDate,
        checkOut: a.endDate,
        nights,
        roomTypes: [],
        cityTax: {
          pricePerPersonPerDay: a.touristTax ?? 0,
          comment: a.comment ?? "",
        },
        subtotal: 0,
      };
    }

    const nightsCount =
      (new Date(a.endDate).getTime() - new Date(a.startDate).getTime()) /
      (1000 * 60 * 60 * 24);

    const totalCost = a.numberOfPersons * a.pricePerDay * nightsCount;

    hotelMap[key].roomTypes.push({
      id: generateId(),
      roomTypeId: String(a.roomTypeId),
      roomTypeName: a.roomTypeName ?? "",
      numberOfPersons: a.numberOfPersons,
      pricePerNightPerPerson: a.pricePerDay,
      comment: a.comment ?? "",
      totalCost,
    });

    hotelMap[key].subtotal += totalCost;
  });

  const hotels = Object.values(hotelMap);

  const dayMap: Record<string, DayService> = {};

  (offer.dailyServices ?? []).forEach((s) => {
    if (!dayMap[s.date]) {
      dayMap[s.date] = {
        id: generateId(),
        date: s.date,
        dayTitle: s.dayName,
        services: [],
        subtotal: 0,
      };
    }

    const subtotal = s.numberOfPersons * s.numberOfDays * s.pricePerDayPerPerson;

    dayMap[s.date].services.push({
      id: generateId(),
      serviceType: mapServiceType(s.serviceType), 
      serviceId: String(s.serviceId),
      quantityPersons: s.numberOfPersons,
      quantityDays: s.numberOfDays,
      pricePerDayPerPerson: s.pricePerDayPerPerson,
      comment: s.comment ?? "",
      subtotal,
    });

    dayMap[s.date].subtotal += subtotal;
  });

  const landServices = Object.values(dayMap);

  // ---- Totals ----
  const totalPrice =
    hotels.reduce((sum, h) => sum + h.subtotal, 0) +
    landServices.reduce((sum, d) => sum + d.subtotal, 0);

  const pricePerPerson =
    offer.numberOfPersons && offer.numberOfPersons > 0
      ? totalPrice / offer.numberOfPersons
      : totalPrice;

  return {
    offerName: offer.name,
    offerCode: offer.code,
    clientId: String(offer.clientId),
    location: offer.location ?? "",
    numberOfPersons: offer.numberOfPersons ?? 1,
    startDate: offer.startDate,
    endDate: offer.endDate,
    option: offer.description ?? "",
    numberOfDays: nights,

    accommodationEnabled: offer.includesAccommodation,
    hotels,

    landServicesEnabled: offer.includesDailyServices,
    landServices,

    totalPrice,
    pricePerPerson,
    last_known_updated_at: offer.last_known_updated_at
  };
}

const serviceTypeMapper: Record<string, ServiceEntry['serviceType']> = {
  aktivnost: "activity",
  restoran: "restaurant",
  vodic: "guide",
  prevodilac: "translator",
  prevoz: "transport",
  poklon: "gift",
};

function mapServiceType(type: string | undefined): ServiceEntry['serviceType'] {
  return serviceTypeMapper[type ?? ""] ?? "activity"; 
}

export function mapSlajdResponseToSlide(apiSlide: SlajdResponse): Slide {
  console.log("SLIIII " + JSON.stringify(apiSlide))
  const sadrzaj = apiSlide.sadrzaj || {};
  const images: string[] = [];

  sadrzaj.slike?.forEach((s: string) => {
      images.push(s);
  });

  let logoObj = ""
  if (sadrzaj.logo) {
    logoObj = sadrzaj.logo;
  }

  return {
    id: apiSlide.id.toString(),
    num: apiSlide.redni_broj,
    type: apiSlide.tip as SlideType,
    title: apiSlide.naslov,
    content: {
      description: sadrzaj.opis || "",
      backgroundImage: logoObj,
      images,
    },
  };
}
