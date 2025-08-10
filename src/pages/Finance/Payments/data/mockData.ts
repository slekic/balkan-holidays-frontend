import { PaymentOffer } from '../utils/types';

export const mockPaymentOffers: PaymentOffer[] = [
  {
    id: '1',
    name: 'Belgrade Cultural Tour',
    code: 'BCT-2024-001',
    client: 'ABC Travel Agency',
    numberOfPersons: 25,
    startDate: '2024-03-15',
    endDate: '2024-03-18',
    totalPrice: 12500,
    totalPaid: 5000,
    status: 'Accepted',
    paymentStatus: 'Partially Paid',
    payments: [
      {
        id: '1',
        amount: 5000,
        comment: 'Initial advance payment',
        date: '2024-01-20',
        method: 'Bank Transfer'
      }
    ],
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    name: 'Serbian Heritage Journey',
    code: 'SHJ-2024-003',
    client: 'Global Adventures Inc.',
    numberOfPersons: 30,
    startDate: '2024-05-05',
    endDate: '2024-05-10',
    totalPrice: 18900,
    totalPaid: 18900,
    status: 'Finished',
    paymentStatus: 'Fully Paid',
    payments: [
      {
        id: '2',
        amount: 9450,
        comment: 'First installment - 50%',
        date: '2024-01-30',
        method: 'Bank Transfer'
      },
      {
        id: '3',
        amount: 9450,
        comment: 'Final payment',
        date: '2024-04-20',
        method: 'Bank Transfer'
      }
    ],
    createdAt: '2024-01-25'
  },
  {
    id: '5',
    name: 'Mountain Adventure Package',
    code: 'MAP-2024-005',
    client: 'Adventure Seekers Ltd.',
    numberOfPersons: 20,
    startDate: '2024-07-15',
    endDate: '2024-07-20',
    totalPrice: 15600,
    totalPaid: 0,
    status: 'Accepted',
    paymentStatus: 'Not Paid',
    payments: [],
    createdAt: '2024-02-10'
  },
  {
    id: '6',
    name: 'Wine Tasting Tour',
    code: 'WTT-2024-006',
    client: 'Gourmet Travels Inc.',
    numberOfPersons: 12,
    startDate: '2024-08-05',
    endDate: '2024-08-08',
    totalPrice: 9800,
    totalPaid: 9800,
    status: 'Finished',
    paymentStatus: 'Fully Paid',
    payments: [
      {
        id: '4',
        amount: 9800,
        comment: 'Full payment in advance',
        date: '2024-02-15',
        method: 'Credit Card'
      }
    ],
    createdAt: '2024-02-05'
  }
];

