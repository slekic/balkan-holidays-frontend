import React from "react";
import { FinanceOffer, ActionType } from "../utils/types";
import FinanceOfferCard from "./FinanceOfferCard";

interface OffersGridProps {
  offers: FinanceOffer[];
  onAction: (action: ActionType, offerId: string) => void;
}

export default function OffersGrid({ offers, onAction }: OffersGridProps) {
  if (offers.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {offers.map((offer) => (
        <FinanceOfferCard
          key={offer.id}
          offer={offer}
          onAction={onAction}
        />
      ))}
    </div>
  );
}
