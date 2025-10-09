export interface LoginResponse {
  data: any;
  token: string;
}

export interface SlikeResponse {
  tip: string,
  url: string
}

export interface HotelResponse {
  id: number;
  naziv: string;
  tipovi_soba: Record<number, string>;
  link_sajta?: string;
  opis?: string;
  broj_soba?: number;
  broj_restorana?: number;
  pdv_grupa?: string;
  slike: SlikeResponse[];
}

export interface PaginatedHotels {
  total: number;
  page: number;
  page_size: number;
  items: HotelResponse[];
}

export interface UslugaResponse {
  id: number;
  naziv: string;
  komentar?: string | null;
  opis?: string | null;
  pdv_grupa: string;
  link_sajta?: string | null;
  cena?: number | null;
  sadrzaj?: string | null;
  slike: SlikeResponse[];
}

export interface PaginatedUsluge {
  total: number;
  page: number;
  page_size: number;
  items: UslugaResponse[];
}

export interface KlijentResponse {
  id: string;
  naziv: string;
  pib: string;
  adresa: string;
  broj_racuna: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedKlijent {
  total: number;
  page: number;
  page_size: number;
  items: KlijentResponse[];
}

export interface PonudaAllResponse {
  id: number;
  naziv: string;
  sifra: string;
  klijent: string;
  broj_osoba: number;
  lokacija: string;
  datum_od: string;
  datum_do: string;
  broj_dana: number;
  cena_po_osobi: number;
  ukupna_cena: number;
  status: string;
  kreirano: string;
  kreirao: string;
  azurirano: string;
  azurirao: string;
  entiteti: string[];
}

export interface PaginatedOffers {
  total: number;
  page: number;
  page_size: number;
  items: PonudaAllResponse[];
}

export interface UpdateStatusParams {
  offerId: string;
  newStatus: string;
}

export interface UpdateStatusResponse {
  success: boolean;
  message?: string;
}

export interface FinansijePonudaResponse {
  id: number;
  naziv: string;
  sifra: string;
  klijent: string;
  broj_osoba: number;
  datum_od: string;
  datum_do: string;
  broj_dana: number;
  ukupna_cena: number;
  status: string; 
  kreirano: string;
  kreirao: string;
  ukupno_placeno: number;
  status_placanja: string;
}

export interface PaginatedFinansijePonuda {
  total: number;
  page: number;
  page_size: number;
  items: FinansijePonudaResponse[];
}

export interface UplataResponse {
  id: number;
  iznos: number;
  datum_uplate: string;
  nacin_uplate: string;
  komentar: string;
}

export interface FinansijePonudaPlacanjaResponse {
  id: number;
  naziv: string;
  sifra: string;
  klijent: string;
  broj_osoba: number;
  datum_od: string;
  datum_do: string;
  broj_dana: number;
  ukupna_cena: number;
  status: string; 
  kreirano: string;
  kreirao: string;
  ukupno_placeno: number;
  status_placanja: string;
  placanja: UplataResponse[];
}

export interface PaginatedFinansijePonudaPlacanja {
  total: number;
  page: number;
  page_size: number;
  items: FinansijePonudaPlacanjaResponse[];
}

export interface PaginatedRashodResponse {
  total: number;
  page: number;
  page_size: number;
  items: RashodResponse[];
  summary: SummaryResponse;
}

export interface SummaryResponse {
  totalAmount: number;
  totalCount: number;
  averageAmount: number;
}

export interface AccommodationResponse {
  hotel_id: number;
  hotel_naziv?: string; 
  tip_sobe: number;
  tip_sobe_naziv?: string;
  broj_osoba: number;
  datum_od: string; 
  datum_do: string;
  boravisna_taksa: number;
  cena_po_danu: number;
  komentar?: string;
}

export interface DailyServiceResponse {
  datum: string;
  naziv_dana: string;
  usluga_id: number;
  usluga_naziv: string;
  tip_usluge: string;
  broj_osoba: number;
  broj_dana: number;
  cena_po_danu_po_osobi: number;
  komentar?: string;
}

export interface OfferResponse {
  id: number;
  sifra: string;
  naziv: string;
  korisnik_id: number;
  klijent_id: number;
  lokacija?: string;
  broj_osoba?: number;
  datum_od: string;
  datum_do: string; 
  opis?: string;
  status: string;
  cena_po_osobi: number;
  cena_po_osobi_pdv: number;
  ukljucuje_smestaj: boolean;
  ukljucuje_usluge: boolean;
  smestaj: AccommodationResponse[];
  usluge_po_danu: DailyServiceResponse[];
  last_known_updated_at: string;
}

export interface KorisnikResponse {
  id: number;
  email: string;
  korisnicko_ime: string;
  uloga: string;
  aktivan: boolean;
  kreirano: string;
  poslednji_login: string;
}

export interface KreirajKorisnikaRequest {
  korisnicko_ime: string;
  email: string;
  lozinka: string;
  uloga: string;
}

export interface RashodCreate {
  ponuda_id: number;
  entitet_id: number;
  entitet_tip: string;
  cena_troska: number;
  komentar?: string;
  fajl_index?: number; 
  naziv?: string;
}

export interface RashodResponse {
  id: number;
  ponudaSifra: string;
  ponudaNaziv: string;
  klijent: string;
  tipEntiteta: string;
  idEntiteta: number;
  nazivEntiteta: string;
  iznos: number;
  komentar?: string;
  kreirano?: string | null;
  datum?: string | null;
  fajl?: string | null; 
}

export interface SablonDanaResponse {
  id: number;
  naslov: string;
  opis?: string | null;

  slike: SlikeResponse[];
}

export interface PaginatedSablonDana {
  total: number;
  page: number;
  page_size: number;
  items: SablonDanaResponse[];
}

export interface SlajdGenerateRequest {
  redni_broj: number;
  naslov: string;                  
  tip: string;                
  sadrzaj: Record<string, any>;     
}

export interface PromeniLozinkuRequest {
  stara_lozinka: string;
  nova_lozinka: string;
}
export interface SlajdResponse {
  redni_broj: number;
  id: number;
  naslov: string;
  tip: string;
  sadrzaj: any;
}

export interface SlajdIdRedniMap {
  [id: number]: number; 
}

export interface OfferStats {
  ukupno_ponuda: number;
  za_pracenje: number;
  prihvaceno: number;
  ukupno_dugovanja: number;
}

export interface OfferFilters {
  search?: string;
  client?: string;
  status?: string;
  createdBy?: string;
  personsMin?: number;
  personsMax?: number;
  priceMin?: number;
  priceMax?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface FinanceFilters {
  search?: string;
  client?: string;
  status?: string;
  paymentStatus?: string;
  createdBy?: string;
  personsMin?: number;
  personsMax?: number;
  priceMin?: number;
  priceMax?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface ExpenseFilters {
  search?: string;
  client?: string;
  entityType?: string;
  entityName?: string;
}

export interface PaymentFilters {
  search?: string;
  client?: string;
  dateFrom?: string;
  dateTo?: string;
  paymentStatus?: string;
}