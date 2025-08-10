export interface DebtOffer {
  id: string;
  name: string;
  code: string;
  client: string;
  numberOfPersons: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  totalPaid: number;
  remainingAmount: number;
  paymentPercentage: number;
  status: "Accepted" | "Finished";
  createdAt: string;
  daysSinceCreated: number;
  urgencyLevel: "Low" | "Medium" | "High" | "Critical";
  lastPaymentDate?: string;
}

export interface DebtFilters {
  client: string;
  urgencyLevel: string;
  status: string;
  amountMin: string;
  amountMax: string;
  dateFrom: string;
  dateTo: string;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  startIndex: number;
}

export interface DebtSummary {
  totalOutstanding: number;
  criticalDebts: number;
  averageDebt: number;
  totalReceivable: number;
  collectionRate: number;
}

