export interface Payment {
  id: string;
  amount: number;
  comment: string;
  date: string;
  method: string;
}

export interface PaymentOffer {
  id: string;
  name: string;
  code: string;
  client: string;
  numberOfPersons: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  totalPaid: number;
  status: 'Accepted' | 'Finished';
  paymentStatus: 'Not Paid' | 'Partially Paid' | 'Fully Paid';
  payments: Payment[];
  createdAt: string;
}

export interface PaymentFilters {
  client: string;
  paymentStatus: string;
  dateFrom: string;
  dateTo: string;
}

export interface NewPayment {
  amount: string;
  comment: string;
  method: string;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  startIndex: number;
}

