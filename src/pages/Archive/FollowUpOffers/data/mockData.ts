import { FollowUpOffer } from "../types";
import { getAllOffers } from "../../../../api/offer";
import { mapPonudaToOffer } from "../../../../utils/offer_response_mappers";

export async function fetchOffers(): Promise<FollowUpOffer[]> {
  try {
    const data = await getAllOffers(1, 100, false, 10);
    return data.items.map(mapPonudaToOffer);
  } catch (error) {
    console.error("Failed to fetch offers:", error);
    return [];
  }
}
