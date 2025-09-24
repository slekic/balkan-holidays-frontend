import { dataURLtoFile } from "../utils/image_converter";
import { HotelResponse, KlijentResponse, PaginatedHotels, PaginatedUsluge, PaginatedKlijent, UslugaResponse, SablonDanaResponse, PaginatedSablonDana } from "./responses";

export async function getAllHotels(page: number = 1, pageSize: number = 100): Promise<PaginatedHotels> {
  const res = await fetch(`http://localhost:8000/cms/hotel/all?page=${page}&page_size=${pageSize}`);
  if (!res.ok) throw new Error("Failed to fetch hotels");
  return res.json();
}

export async function createHotel(hotel: Omit<HotelResponse, 'id' | 'createdAt' | 'updatedAt'>): Promise<HotelResponse> {
  const res = await fetch("http://localhost:8000/cms/hotel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hotel)
  });

  if (!res.ok) throw new Error("Failed to create hotel");

  console.log(res)
  return res.json(); 
}

export async function updateHotelApi(
  id: string,
  hotel: Partial<Omit<HotelResponse, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<HotelResponse> {
 
  const res = await fetch(`http://localhost:8000/cms/hotel/${Number(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hotel)
  });

  if (!res.ok) throw new Error("Failed to update hotel");

  return res.json();
}

export async function uploadImages(
  entityId: number,
  entityType: string,
  files: File[] = [],
  tipovi: string[] = [],
  zaUklanjanje: string[] = []
) {
  const formData = new FormData();
  formData.append("entitet", entityType);
  formData.append("entitet_id", entityId.toString());

  files.forEach(file => formData.append("files", file));
  tipovi.forEach(tip => formData.append("tip_slike", tip));
  zaUklanjanje.forEach(path => formData.append("remove_paths", path));

  const res = await fetch("http://localhost:8000/upload", {
    method: "POST",
    body: formData
  });

  if (!res.ok) throw new Error("Failed to upload images");

  const data = await res.json(); 

  if (data.slike?.length === 0) return null;

  if (data.slike?.length > 0) {
    data.slike = data.slike.map((slika: { putanja: string }) => ({
      ...slika,
      putanja: `http://localhost:8000/${slika.putanja}`
    }));
  }

  if (data.slike?.length === 1 && tipovi.length === 1 && tipovi[0] === "logo") {
    return data.slike[0].putanja;
  }

  return data;
}

export async function uploadMultipleEntitiesImages(
  entityIds: number[],
  entityTypes: string[],
  files: string[] = [], 
  tipovi: string[] = [], 
) {
  const formData = new FormData();

  entityIds.forEach((id, index) => {
    formData.append("entiteti", entityTypes[index]);
    formData.append("entitet_ids", id.toString());

    formData.append("files", dataURLtoFile(files[index], `slide-image-${id}-${index}`));
    formData.append("tip_slike", tipovi[index]);
  });

  const res = await fetch("http://localhost:8000/upload-multiple", {
    method: "POST",
    body: formData
  });

  if (!res.ok) throw new Error("Failed to upload images");

  const data = await res.json();

  if (data.slike?.length > 0) {
    data.slike = data.slike.map((slika: { putanja: string }) => ({
      ...slika,
      putanja: `http://localhost:8000/${slika.putanja}`
    }));
  }

  return data;
}

export async function deleteHotelApi(id: string) {
  const res = await fetch(`http://localhost:8000/hotel/${Number(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete hotel");
  return await res.json();
}

export async function getAllUsluge(
  tip: string,
  page: number = 1,
  pageSize: number = 100
): Promise<PaginatedUsluge> {
  const url = `http://localhost:8000/cms/usluga/${tip}/all?page=${page}&page_size=${pageSize}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch usluge");
  return res.json();
}

export async function createUsluga(
  tip: string,
  usluga: Omit<UslugaResponse, 'id' | 'createdAt' | 'updatedAt'>
): Promise<UslugaResponse> {
  console.log(JSON.stringify(usluga))
  const res = await fetch(`http://localhost:8000/cms/usluga/${tip}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usluga),
  });

  if (!res.ok) throw new Error("Failed to create usluga");
  return res.json();
}

export async function updateUslugaApi(
  id: number,
  usluga: Partial<UslugaResponse>
): Promise<UslugaResponse> {
  const res = await fetch(`http://localhost:8000/cms/usluga/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usluga),
  });

  if (!res.ok) throw new Error("Failed to update usluga");
  return res.json();
}

export async function deleteUslugaApi(id: number) {
  const res = await fetch(`http://localhost:8000/cms/usluga/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete usluga");
  return res.json();
}

export async function fetchClients(): Promise<PaginatedKlijent> {
  const res = await fetch(`http://localhost:8000/cms/klijent/all?page=1&page_size=100`);
  if (!res.ok) throw new Error("Failed to fetch clients");
  return res.json(); 
}

export async function createClient(client: Omit<KlijentResponse, "id" | "createdAt" | "updatedAt">): Promise<KlijentResponse> {
  const res = await fetch(`http://localhost:8000/cms/klijent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      naziv: client.naziv,
      pib: client.pib,
    }),
  });
  if (!res.ok) throw new Error("Failed to create client");
  return res.json();
}

export async function updateClientApi(id: number, client: Partial<KlijentResponse>): Promise<KlijentResponse> {
  const res = await fetch(`http://localhost:8000/cms/klijent/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      naziv: client.naziv,
      pib: client.pib,
    }),
  });
  if (!res.ok) throw new Error("Failed to update client");
  return res.json();
}

export async function deleteClientApi(id: number): Promise<void> {
  const res = await fetch(`http://localhost:8000/cms/klijent/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete client");
}

export async function getAllSabloni(page = 1, pageSize = 100): Promise<PaginatedSablonDana> {
  const res = await fetch(`http://localhost:8000/cms/sablon/all?page=${page}&page_size=${pageSize}`);
  if (!res.ok) throw new Error("Failed to fetch sabloni");
  return res.json();
}

export async function createSablon(sablon: Omit<SablonDanaResponse, 'id' | 'slike'>): Promise<SablonDanaResponse> {
  const res = await fetch(`http://localhost:8000/cms/sablon`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sablon),
  });
  if (!res.ok) throw new Error("Failed to create sablon");
  return res.json();
}

export async function updateSablonApi(id: number, sablon: Partial<SablonDanaResponse>): Promise<SablonDanaResponse> {
  const res = await fetch(`http://localhost:8000/cms/sablon/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sablon),
  });
  if (!res.ok) throw new Error("Failed to update sablon");
  return res.json();
}

export async function deleteSablonApi(id: number) {
  const res = await fetch(`http://localhost:8000/cms/sablon/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete sablon");
  return res.json();
}
