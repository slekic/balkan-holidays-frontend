import { BACKEND_URL } from "../config";
import { ExpenseFilters, FinanceFilters, FinansijePonudaPlacanjaResponse, PaginatedFinansijePonuda, PaginatedFinansijePonudaPlacanja, PaginatedRashodResponse, RashodCreate, RashodResponse } from "./responses";

export const STATUS_MAP_REQ_RES: Record<string, string> = {
  "Sent": "poslato",
  "Accepted": "prihvaceno",
  "Rejected": "odbijeno",
  "Finished": "zavrseno",
};

export const PAY_STATUS_MAP_REQ_RES: Record<string, string> = {
  "Fully Paid": "placeno",
  "Not Paid": "neplaceno",
  "Partially Paid": "polovicno",
};

export const ENTITY_MAP_REQ_RES: Record<string, string> = {
  "restaurant": "restoran",
  "translator": "prevodilac",
  "gift": "poklon",
  "hotel": "hotel",
  "transport":"prevoz",
  "guide":"vodic",
  "activity":"aktivnost",
  "other":"ostalo"
};

export async function getAllFinanceOffers(
  page: number = 1,
  pageSize: number = 100,
  filters: FinanceFilters = {},
  onlyDeleted: boolean = false,
): Promise<PaginatedFinansijePonuda> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    only_deleted: onlyDeleted.toString(),
  });

    if (filters.search) queryParams.append("search", filters.search);
    if (filters.client) queryParams.append("client", filters.client);
  
    if (filters.paymentStatus) {
      const mappedStatus = PAY_STATUS_MAP_REQ_RES[filters.paymentStatus] || filters.paymentStatus.toLowerCase();
      queryParams.append("payment_status", mappedStatus);
    }

    if (filters.status) {
      const mappedStatus = STATUS_MAP_REQ_RES[filters.status] || filters.status.toLowerCase();
      queryParams.append("status", mappedStatus);
    }
  
    if (filters.createdBy) queryParams.append("created_by", filters.createdBy);
    if (filters.personsMin !== undefined) queryParams.append("persons_min", filters.personsMin.toString());
    if (filters.personsMax !== undefined) queryParams.append("persons_max", filters.personsMax.toString());
    if (filters.priceMin !== undefined) queryParams.append("price_min", filters.priceMin.toString());
    if (filters.priceMax !== undefined) queryParams.append("price_max", filters.priceMax.toString());
    if (filters.dateFrom) queryParams.append("date_from", filters.dateFrom);
    if (filters.dateTo) queryParams.append("date_to", filters.dateTo);

  const res = await fetch(
    `${BACKEND_URL}/finansije/all?${queryParams.toString()}`
  );

  if (!res.ok) throw new Error("Failed to fetch finance offers");
  return res.json();
}

export async function getAllFinanceOffersWithPayments(
  page: number = 1,
  pageSize: number = 100,
  onlyDeleted: boolean = false,
  excludeCompleted: boolean = false 
): Promise<PaginatedFinansijePonudaPlacanja> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    only_deleted: onlyDeleted.toString(),
    exclude_completed: excludeCompleted.toString(), 
  });

  const res = await fetch(
    `${BACKEND_URL}/finansije/all/payments?${queryParams.toString()}`
  );

  if (!res.ok) throw new Error("Failed to fetch finance offers with payments");
  return res.json();
}

export async function getAllExpenses(
  page: number = 1,
  pageSize: number = 100,
  filters: ExpenseFilters = {},
  onlyDeleted: boolean = false,
  excludeCompleted: boolean = false
): Promise<PaginatedRashodResponse> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    only_deleted: onlyDeleted.toString(),
    exclude_completed: excludeCompleted.toString(),
  });
   if (filters.search) queryParams.append("search", filters.search);
   if (filters.client) queryParams.append("client", filters.client);
  
   if (filters.entityName) queryParams.append("entity_name", filters.entityName);

   if (filters.entityType) {
      const mapped = ENTITY_MAP_REQ_RES[filters.entityType] || filters.entityType.toLowerCase();
      queryParams.append("entity_type", mapped);
    }

  const res = await fetch(
    `${BACKEND_URL}/finansije/all/rashodi?${queryParams.toString()}`
  );

  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

export async function createPayment(
  offerId: string,
  payment: { amount: number; comment: string; method: string }
): Promise<FinansijePonudaPlacanjaResponse> {
    const body = {
    ponuda_id: Number(offerId),
    kolicina_za_uplatu: payment.amount,
    komentar: payment.comment,
    nacin_placanja: payment.method,
  };

  console.log("Request body for createPayment:", JSON.stringify(body));

  const res = await fetch(`${BACKEND_URL}/finansije/uplata`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ponuda_id: Number(offerId),
      kolicina_za_uplatu: payment.amount,
      komentar: payment.comment,
      nacin_placanja: payment.method,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create payment");
  }

  const data = await res.json();

  return data;
}

export async function updatePaymentApi(
  paymentId: string,
  payment: { amount: number; comment: string; method: string }
): Promise<FinansijePonudaPlacanjaResponse> {
  const body = {
    kolicina_za_uplatu: payment.amount,
    komentar: payment.comment,
    nacin_placanja: payment.method,
  };

  console.log("Request body for updatePayment:", JSON.stringify(body));

  const res = await fetch(`${BACKEND_URL}/finansije/uplata/${Number(paymentId)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Failed to update payment");
  }

  return res.json();
}

export async function deletePaymentApi(id: string) {
  const res = await fetch(`${BACKEND_URL}/finansije/uplata/${Number(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete payment");
  return await res.json();
}

export async function createRashodiBatch(
  rashodi: RashodCreate[],
  files?: File[]
): Promise<RashodResponse[]> {
  const formData = new FormData();

  formData.append("rashodi", JSON.stringify(rashodi));

  if (files) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  const res = await fetch(`${BACKEND_URL}/finansije/rashodi/batch/`, {
    method: "POST",
    body: formData, 
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create rashodi batch");
  }

  const data: RashodResponse[] = await res.json();
  return data;
}