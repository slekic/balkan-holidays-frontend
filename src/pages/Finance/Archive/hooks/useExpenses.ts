import { useState, useEffect, useMemo } from "react";
import { ExpenseEntry } from "../../../../types/offer";
import { BACKEND_URL } from "../../../../config";
import { createRashodiBatch } from "../../../../api/finances";
import { toast } from "react-toastify";
import { generateId } from "../../../OfferCreation/utils/id";


export function useFinanceExpenses(offerId: string | null, open: boolean) {
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);

  useEffect(() => {
  if (!open || !offerId) return;

  setExpenses([]);
  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/finansije/rashodi/ponuda/${offerId}`);
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((r: any) => {
          const id = r.id ? r.id.toString() : generateId();
          return {
            id,
            entityType: r.tipEntiteta,
            entityId: r.idEntiteta,
            entityName: r.nazivEntiteta,
            costAmount: r.iznos,
            comment: r.komentar,
            uploadedFile: undefined,
          };
        });
        setExpenses(mapped);
      }
    } catch (err) {
      console.error("Failed to load expenses:", err);
    }
  };

  fetchExpenses();
}, [open, offerId]);


  const handleAddExpense = () => {
    setExpenses((prev) => [
      ...prev,
      {
        id: generateId(),
        entityType: "other",
        entityId: "",
        entityName: "",
        costAmount: 0,
        comment: "",
        uploadedFile: undefined,
      },
    ]);
  };

  const handleUpdateExpense = (id: string, updates: Partial<ExpenseEntry>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + (e.costAmount || 0), 0), [expenses]);

  const saveExpenses = async () => {
    if (!offerId) return;
    const files: File[] = [];
    const payload = expenses.map((e, idx) => {
      if (e.uploadedFile) files.push(e.uploadedFile);
      return {
        ponuda_id: Number(offerId),
        entitet_id: Number(e.entityId),
        entitet_tip: e.entityType,
        cena_troska: e.costAmount || 0,
        komentar: e.comment || "",
        fajl_index: e.uploadedFile ? idx : -1,
        naziv: e.entityName,
      };
    });

    try {
      await createRashodiBatch(payload, files);
      toast.success("Rashodi uspešno sačuvani");
    } catch (err) {
      console.error("Failed to save expenses", err);
      toast.error("Greška prilikom čuvanja rashoda");
    }
  };

  return {
    expenses,
    handleAddExpense,
    handleUpdateExpense,
    handleRemoveExpense,
    totalExpenses,
    saveExpenses,
    setExpenses,
  };
}
