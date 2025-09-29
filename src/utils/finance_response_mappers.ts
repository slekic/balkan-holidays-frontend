import { FinansijePonudaPlacanjaResponse, FinansijePonudaResponse, RashodResponse } from "../api/responses";
import { FinanceOffer } from "../pages/Finance/Archive/utils";
import { DebtOffer } from "../pages/Finance/Debts/utils";
import { Expense } from "../pages/Finance/Expenses/utils";
import { PaymentOffer } from "../pages/Finance/Payments/utils";

export function mapPonudaFinanceToOffer(data: FinansijePonudaResponse): FinanceOffer {
  const STATUS_MAP: Record<string, "Accepted" | "Finished"> = {
    "Prihvaćena": "Accepted",
    "Završeno": "Finished",
  };

  const PAYMENT_STATUS_MAP: Record<string, "Not Paid" | "Partially Paid" | "Fully Paid"> = {
    "Neplaćeno": "Not Paid",
    "Polovično plaćeno": "Partially Paid",
    "Plaćeno": "Fully Paid",
  };

  return {
    id: data.id.toString(),
    name: data.naziv,
    code: data.sifra,
    client: data.klijent,
    numberOfPersons: data.broj_osoba,
    startDate: data.datum_od,
    endDate: data.datum_do,
    days: data.broj_dana,
    totalPrice: data.ukupna_cena,
    status: STATUS_MAP[data.status] || "Accepted", 
    createdAt: data.kreirano,
    createdBy: data.kreirao,
    totalPaid: data.ukupno_placeno,
    paymentStatus: PAYMENT_STATUS_MAP[data.status_placanja] || "Not Paid", 
  };
}

export function mapPonudaFinanceWithPaymentsToOffer(
  p: FinansijePonudaPlacanjaResponse
): PaymentOffer {
  return {
    id: p.id.toString(),
    name: p.naziv,
    code: p.sifra,
    client: p.klijent,
    numberOfPersons: p.broj_osoba,
    startDate: p.datum_od,
    endDate: p.datum_do,
    totalPrice: p.ukupna_cena,
    status: p.status === "Accepted" ? "Accepted" : "Finished",
    createdAt: p.kreirano,
    totalPaid: p.ukupno_placeno,
    paymentStatus:
      p.status_placanja === "Neplaćeno"
        ? "Not Paid"
        : p.status_placanja === "Polovično plaćeno"
        ? "Partially Paid"
        : "Fully Paid",
    payments: p.placanja.map((u: any) => ({
      id: u.id.toString(),
      amount: u.iznos,
      comment: u.komentar,
      date: u.datum_uplate, 
      method: u.nacin_uplate || "Unknown", 
    })),
  };
}

export function mapPonudaFinanceWithPaymentsToDebtOffer(
  p: FinansijePonudaPlacanjaResponse
): DebtOffer {
  const totalPaid = p.placanja.reduce((sum, u) => sum + Number(u.iznos), 0);
  const remainingAmount = (p.ukupna_cena || 0) - totalPaid;
  const paymentPercentage = p.ukupna_cena ? Math.round((totalPaid / p.ukupna_cena) * 100) : 0;
  const lastPaymentDate =
    p.placanja.length > 0
      ? p.placanja.reduce((latest, u) =>
          u.datum_uplate > latest ? u.datum_uplate : latest,
        p.placanja[0].datum_uplate)
      : undefined;

  const daysSinceCreated = p.kreirano
    ? Math.floor(
        (new Date().getTime() - new Date(p.kreirano).getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  let urgencyLevel: 'High' | 'Medium' | 'Low' = 'Low';
  if (remainingAmount > 0 && daysSinceCreated > 30) urgencyLevel = 'High';
  else if (remainingAmount > 0) urgencyLevel = 'Medium';

  return {
    id: p.id.toString(),
    name: p.naziv,
    code: p.sifra,
    client: p.klijent,
    numberOfPersons: p.broj_osoba,
    startDate: p.datum_od,
    endDate: p.datum_do,
    totalPrice: p.ukupna_cena,
    totalPaid,
    remainingAmount,
    paymentPercentage,
    status: p.status === 'Accepted' ? 'Accepted' : 'Finished',
    createdAt: p.kreirano,
    daysSinceCreated,
    urgencyLevel,
    lastPaymentDate,
  };
}

export function mapPonudaNaExpense(rashod: RashodResponse): Expense {
    const entityTypeMap: Record<string, Expense["entityType"]> = {
        restoran: "restaurant",
        hotel: "hotel",
        prevoz: "transport",
        vodic: "guide",
        aktivnost: "activity",
        poklon: "gift",
        ostalo: "other"
    };

    return {
    id: rashod.id.toString(),
    offerCode: rashod.ponudaSifra || "",
    offerName: rashod.ponudaNaziv || "",
    client: rashod.klijent || "",
    entityType: entityTypeMap[rashod.tipEntiteta?.toLowerCase() || ""] || "other",
    entityName: rashod.nazivEntiteta || "",
    amount: rashod.iznos || 0,
    comment: rashod.komentar || "",
    //attachedFile: rashod.dokument || undefined,
    createdAt: rashod.kreirano || "",
    travelDate: rashod.datum || "",
    attachedFile: rashod.fajl || "",
  };
}