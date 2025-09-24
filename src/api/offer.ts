import { Slide } from "../pages/OfferCreation/utils/constants";
import { OfferResponse, PaginatedOffers, SlajdGenerateRequest, SlajdIdRedniMap, SlajdResponse, UpdateStatusParams, UpdateStatusResponse } from "./responses";

export async function getAllOffers(
  page: number = 1,
  pageSize: number = 100,
  onlyDeleted: boolean = false,
  max_days_since_update: number = -1
): Promise<PaginatedOffers> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    only_deleted: onlyDeleted.toString(),
  });

  if (max_days_since_update >= 0) {
    queryParams.append("max_days_since_update", max_days_since_update.toString());
  }

  const res = await fetch(`http://localhost:8000/ponuda/all?${queryParams.toString()}`);

  if (!res.ok) throw new Error("Failed to fetch offers");
  return res.json();
}

export async function getOffer(
  id: string
): Promise<OfferResponse> {

  const res = await fetch(`http://localhost:8000/ponuda/${Number(id)}`);

  if (!res.ok) throw new Error("Failed to fetch offer");
  return res.json();
}

export async function getSlides(
  id: string
): Promise<SlajdResponse[]> {

  const res = await fetch(`http://localhost:8000/ponuda/slides/${Number(id)}`);

  if (!res.ok) throw new Error("Failed to fetch offer slides");
  return res.json();
}

export async function saveSlides(
  ponudaId: string,
  slajdovi: SlajdGenerateRequest[]
): Promise<SlajdIdRedniMap> {
  const res = await fetch(
    `http://localhost:8000/ponuda/save-slides/${Number(ponudaId)}`,
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

export const STATUS_MAP_REQ_RES: Record<string, string> = {
  "Sent": "poslato",
  "Accepted": "prihvaceno",
  "Rejected": "odbijeno",
  "Finished": "zavrseno",
};

export async function updateOfferStatusAPI({
  offerId,
  newStatus,
}: UpdateStatusParams): Promise<UpdateStatusResponse> {
  try {
    console.log("STAAT " + newStatus)
    const mappedStatus = STATUS_MAP_REQ_RES[newStatus] || newStatus;

    console.log(JSON.stringify({ status: mappedStatus }))
    const response = await fetch(`http://localhost:8000/ponuda/${offerId}/status`, {
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
  const res = await fetch(`http://localhost:8000/ponuda/${Number(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete offer");
  return await res.json();
}

export async function restoreOfferApi(id: string) {
  const res = await fetch(`http://localhost:8000/ponuda/${Number(id)}/vrati`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to restore offer");
  return await res.json();
}

export async function duplicateOfferApi(id: string) {
  const res = await fetch(`http://localhost:8000/ponuda/${Number(id)}/dupliraj`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to duplicate offer");
  return await res.json();
}