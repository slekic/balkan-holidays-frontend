import { DebtOffer, DebtSummary } from "./types";

export const getUrgencyColor = (level: string) => {
  switch (level) {
    case "Low":
      return "bg-green-100 text-green-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "High":
      return "bg-orange-100 text-orange-800";
    case "Critical":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Accepted":
      return "bg-green-100 text-green-800";
    case "Finished":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getPaymentProgressColor = (percentage: number) => {
  if (percentage >= 75) return "bg-green-600";
  if (percentage >= 50) return "bg-yellow-500";
  if (percentage >= 25) return "bg-orange-500";
  return "bg-red-500";
};

export const calculateDebtSummary = (offers: DebtOffer[]): DebtSummary => {
  const totalOutstanding = offers.reduce(
    (sum, offer) => sum + offer.remainingAmount,
    0
  );
  const averageDebt = offers.length > 0 ? totalOutstanding / offers.length : 0;
  const criticalDebts = offers.filter(
    (offer) => offer.urgencyLevel === "Critical"
  ).length;
  const totalReceivable = offers.reduce(
    (sum, offer) => sum + offer.totalPrice,
    0
  );
  const collectionRate = totalReceivable > 0
    ? Math.round(((totalReceivable - totalOutstanding) / totalReceivable) * 100)
    : 0;

  return {
    totalOutstanding,
    criticalDebts,
    averageDebt,
    totalReceivable,
    collectionRate,
  };
};

export const formatCurrency = (amount: number) => {
  return `€${amount.toLocaleString()}`;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

