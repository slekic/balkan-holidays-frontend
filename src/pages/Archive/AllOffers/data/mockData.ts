import { Offer } from "../types";
import { getAllOffers } from "../../../../api/offer";
import { mapPonudaToOffer } from "../../../../utils/offer_response_mappers";

export async function fetchOffers(): Promise<{ items: Offer[], total: number }> {
  try {
    const data = await getAllOffers();
    return {
      items: data.items.map(mapPonudaToOffer),
      total: data.total ?? data.items.length
    };
  } catch (error) {
    console.error("Failed to fetch offers:", error);
    return { items: [], total: 0 };
  }
}
