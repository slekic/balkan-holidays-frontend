export interface Expense {
  id: string;
  offerCode: string;
  offerName: string;
  client: string;
  entityType:
    | "hotel"
    | "restaurant"
    | "transport"
    | "guide"
    | "activity"
    | "gift"
    | "other";
  entityName: string;
  amount: number;
  comment: string;
  attachedFile?: string;
  createdBy: string;
  createdAt: string;
  travelDate: string;
}

export interface ExpenseFilters {
  entityType: string;
  entityName: string;
  client: string;
  createdBy: string;
  dateFrom: string;
  dateTo: string;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  startIndex: number;
}

export interface ExpenseSummary {
  totalAmount: number;
  totalCount: number;
  averageAmount: number;
}
