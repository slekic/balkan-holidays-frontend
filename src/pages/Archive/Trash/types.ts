export interface DeletedOffer {
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
  deletedAt: string;
  deletedBy: string;
}

export interface TrashFilters {
  client: string;
  createdBy: string;
  deletedBy: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}
