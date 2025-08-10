export interface FinanceOffer {
  id: string;
  name: string;
  code: string;
  client: string;
  numberOfPersons: number;
  startDate: string;
  endDate: string;
  days: number;
  totalPrice: number;
  status: "Accepted" | "Finished";
  createdAt: string;
  createdBy: string;
  totalPaid: number;
  paymentStatus: "Not Paid" | "Partially Paid" | "Fully Paid";
}

export interface FinanceFilters {
  client: string;
  createdBy: string;
  status: string;
  paymentStatus: string;
  personsMin: string;
  personsMax: string;
  priceMin: string;
  priceMax: string;
  dateFrom: string;
  dateTo: string;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  startIndex: number;
}

export type ActionType = "view" | "edit" | "duplicate" | "proforma" | "advance" | "final";
