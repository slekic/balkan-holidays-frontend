import { BACKEND_URL } from "../config";
import { OfferFilters, OfferResponse, OfferStats, PaginatedOffers, SlajdGenerateRequest, SlajdIdRedniMap, SlajdResponse, SlideResponse, UpdateStatusParams, UpdateStatusResponse } from "./responses";

export const STATUS_MAP_REQ_RES: Record<string, string> = {
  "Sent": "poslato",
  "Accepted": "prihvaceno",
  "Rejected": "odbijeno",
  "Finished": "zavrseno",
};

export async function getAllOffers(
  page: number = 1,
  pageSize: number = 100,
  onlyDeleted: boolean = false,
  max_days_since_update: number = -1,
  filters: OfferFilters = {}
): Promise<PaginatedOffers> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    only_deleted: onlyDeleted.toString(),
  });

  if (max_days_since_update >= 0) {
    queryParams.append("max_days_since_update", max_days_since_update.toString());
  }

  // 🔍 Dodaj filtere ako postoje
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.client) queryParams.append("client", filters.client);

  if (filters.status) {
    const mappedStatus = STATUS_MAP_REQ_RES[filters.status] || filters.status.toLowerCase();
    queryParams.append("status", mappedStatus);
  }

  if (filters.createdBy) queryParams.append("created_by", filters.createdBy);
  if (filters.personsMin !== undefined) queryParams.append("persons_min", filters.personsMin.toString());
  if (filters.personsMax !== undefined) queryParams.append("persons_max", filters.personsMax.toString());
  if (filters.priceMin !== undefined) queryParams.append("price_min", filters.priceMin.toString());
  if (filters.priceMax !== undefined) queryParams.append("price_max", filters.priceMax.toString());
  if (filters.dateFrom) queryParams.append("date_from", filters.dateFrom);
  if (filters.dateTo) queryParams.append("date_to", filters.dateTo);

  const res = await fetch(`${BACKEND_URL}/ponuda/all?${queryParams.toString()}`);

  if (!res.ok) throw new Error("Failed to fetch offers");
  return res.json();
}

export async function getOffer(
  id: string
): Promise<OfferResponse> {

  const res = await fetch(`${BACKEND_URL}/ponuda/${Number(id)}`);

  if (!res.ok) throw new Error("Failed to fetch offer");
  return res.json();
}

export async function getStats(): Promise<OfferStats> {

  const res = await fetch(`${BACKEND_URL}/ponuda/stats`);

  if (!res.ok) throw new Error("Failed to fetch offer stats");
  return res.json();
}

export async function getSlides(
  id: string
): Promise<SlajdResponse[]> {

  const res = await fetch(`${BACKEND_URL}/ponuda/slides/${Number(id)}`);

  if (!res.ok) throw new Error("Failed to fetch offer slides");
  return res.json();
}

export async function saveSlides(
  ponudaId: string,
  slajdovi: SlajdGenerateRequest[]
): Promise<SlajdIdRedniMap> {
  const res = await fetch(
    `${BACKEND_URL}/ponuda/save-slides/${Number(ponudaId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slajdovi),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to save offer slides");
  }

  const data: SlajdIdRedniMap = await res.json();
  return data;
}

export async function reorderSlides(
  offerId: string,
  renumberMap: Record<number, number>
): Promise<any> {
  console.log("REQ", JSON.stringify({ renumberMap }))
  const res = await fetch(`${BACKEND_URL}/ponuda/slides-reorder/${Number(offerId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ renumberMap }),
  });

  if (!res.ok) {
    throw new Error(`Failed to reorder slides, status: ${res.status}`);
  }

  return;
}

export async function addSlideApi(
  ponudaId: string,
  slajd: SlajdGenerateRequest
): Promise<SlideResponse> {
  const res = await fetch(
    `${BACKEND_URL}/ponuda/add-slide/${Number(ponudaId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slajd),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to add slide");
  }

  const data: SlideResponse = await res.json();
  return data;
}

export async function updateOfferStatusAPI({
  offerId,
  newStatus,
}: UpdateStatusParams): Promise<UpdateStatusResponse> {
  try {
    console.log("STAAT " + newStatus)
    const mappedStatus = STATUS_MAP_REQ_RES[newStatus] || newStatus;

    console.log(JSON.stringify({ status: mappedStatus }))
    const response = await fetch(`${BACKEND_URL}/ponuda/${offerId}/status`, {
      method: "PATCH", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: mappedStatus }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Failed to update status" };
    }

    console.log(JSON.stringify(response))

    return { success: true };
  } catch (error) {
    console.error("Error updating offer status:", error);
    return { success: false, message: "Network error" };
  }
}

export async function deleteOfferApi(id: string) {
  const res = await fetch(`${BACKEND_URL}/ponuda/soft/${Number(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete offer");
  return await res.json();
}

export async function deletePermOfferApi(id: string) {
  const res = await fetch(`${BACKEND_URL}/ponuda/${Number(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete offer");
  return await res.json();
}

export async function restoreOfferApi(id: string) {
  const res = await fetch(`${BACKEND_URL}/ponuda/${Number(id)}/vrati`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to restore offer");
  return await res.json();
}

export async function duplicateOfferApi(id: string) {
  const res = await fetch(`${BACKEND_URL}/ponuda/${Number(id)}/dupliraj`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to duplicate offer");
  return await res.json();
}