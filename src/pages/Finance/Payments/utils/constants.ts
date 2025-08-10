export const PAYMENT_METHODS = [
  { value: 'Bank Transfer', label: 'Bankovni transfer' },
  { value: 'Credit Card', label: 'Kreditna kartica' },
  { value: 'Cash', label: 'Gotovina' },
  { value: 'Check', label: 'Ček' }
] as const;

export const PAYMENT_STATUS_OPTIONS = [
  { value: '', label: 'Svi statusi uplate' },
  { value: 'Not Paid', label: 'Nije plaćeno' },
  { value: 'Partially Paid', label: 'Delimično plaćeno' },
  { value: 'Fully Paid', label: 'Uplaćeno u celosti' }
] as const;

export const CLIENT_OPTIONS = [
  { value: '', label: 'Svi klijenti' },
  { value: 'ABC Travel Agency', label: 'ABC Travel Agency' },
  { value: 'Global Adventures Inc.', label: 'Global Adventures Inc.' },
  { value: 'Adventure Seekers Ltd.', label: 'Adventure Seekers Ltd.' },
  { value: 'Gourmet Travels Inc.', label: 'Gourmet Travels Inc.' }
] as const;

export const ITEMS_PER_PAGE = 8;

export const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'Not Paid': return 'bg-red-100 text-red-800';
    case 'Partially Paid': return 'bg-yellow-100 text-yellow-800';
    case 'Fully Paid': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getPaymentProgressColor = (percentage: number) => {
  if (percentage === 100) return 'bg-green-600';
  if (percentage > 0) return 'bg-yellow-500';
  return 'bg-red-500';
};

