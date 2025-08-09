import { useEffect } from "react";
import { DayService, OfferFormData } from "../../../types/offer";
import { generateId } from "../utils/id";

export function useDatesAndDays(formData: OfferFormData, setFormData: (updater: any) => void) {
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setFormData((prev: OfferFormData) => ({
        ...prev,
        numberOfDays: diffDays,
        landServices: generateDayServices(prev.startDate, prev.endDate, prev.landServices),
      }));
    }
  }, [formData.startDate, formData.endDate]);
}

export function generateDayServices(
  startDate: string,
  endDate: string,
  existingServices: DayService[]
): DayService[] {
  if (!startDate || !endDate) return [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days: DayService[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    const existingDay = existingServices.find((service) => service.date === dateStr);
    if (existingDay) {
      days.push(existingDay);
    } else {
      days.push({ id: generateId(), date: dateStr, dayTitle: `Day ${days.length + 1}`, services: [], subtotal: 0 });
    }
  }
  return days;
}


