export interface FollowUpOffer {
  id: string;
  name: string;
  code: string;
  client: string;
  numberOfPersons: number;
  startDate: string;
  endDate: string;
  days: number;
  totalPrice: number;
  status: "Sent" | "Accepted" | "Rejected" | "Finished";
  createdAt: string;
  createdBy: string;
  entities: string[];
  lastUpdated: string;
  daysSinceUpdate: number;
}

export interface FollowUpOfferFilters {
  client: string;
  entity: string;
  createdBy: string;
  status: string;
  personsMin: string;
  personsMax: string;
  priceMin: string;
  priceMax: string;
  dateFrom: string;
  dateTo: string;
}
