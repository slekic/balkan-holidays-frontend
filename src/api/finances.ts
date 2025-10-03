import { BACKEND_URL } from "../config";
import { FinansijePonudaPlacanjaResponse, PaginatedFinansijePonuda, PaginatedFinansijePonudaPlacanja, PaginatedRashodResponse, RashodCreate, RashodResponse } from "./responses";

export async function getAllFinanceOffers(
  page: number = 1,
  pageSize: number = 100,
  onlyDeleted: boolean = false,
): Promise<PaginatedFinansijePonuda> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    only_deleted: onlyDeleted.toString(),
  });

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
  onlyDeleted: boolean = false,
  excludeCompleted: boolean = false
): Promise<PaginatedRashodResponse> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    only_deleted: onlyDeleted.toString(),
    exclude_completed: excludeCompleted.toString(),
  });

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