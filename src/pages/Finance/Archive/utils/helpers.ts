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

export const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "Not Paid":
      return "bg-red-100 text-red-800";
    case "Partially Paid":
      return "bg-yellow-100 text-yellow-800";
    case "Fully Paid":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const calculatePaymentProgress = (totalPaid: number, totalPrice: number) => {
  return Math.round((totalPaid / totalPrice) * 100);
};

export const formatCurrency = (amount: number) => {
  return `€${amount.toLocaleString()}`;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
