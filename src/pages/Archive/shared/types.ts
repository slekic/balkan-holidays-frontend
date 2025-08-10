export interface Offer {
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
}

export interface DeletedOffer extends Offer {
  deletedAt: string;
  deletedBy: string;
}

export interface FollowUpOffer extends Offer {
  lastUpdated: string;
  daysSinceUpdate: number;
}

export interface FilterState {
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
  deletedBy?: string;
}
