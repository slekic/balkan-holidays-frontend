import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download,
  Plus,
  Eye,
  Calendar,
  Users,
  Euro,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  History
} from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  comment: string;
  date: string;
  method: string;
}

interface PaymentOffer {
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

const mockPaymentOffers: PaymentOffer[] = [
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

export default function Payments() {
  const [offers] = useState<PaymentOffer[]>(mockPaymentOffers);
  const [filteredOffers, setFilteredOffers] = useState<PaymentOffer[]>(mockPaymentOffers);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPayment, setShowAddPayment] = useState<string | null>(null);
  const [showPaymentHistory, setShowPaymentHistory] = useState<string | null>(null);
  const [newPayment, setNewPayment] = useState({
    amount: '',
    comment: '',
    method: 'Bank Transfer'
  });
  const [filters, setFilters] = useState({
    client: '',
    paymentStatus: '',
    dateFrom: '',
    dateTo: ''
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOffers = filteredOffers.slice(startIndex, startIndex + itemsPerPage);

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Not Paid': return 'bg-red-100 text-red-800';
      case 'Partially Paid': return 'bg-yellow-100 text-yellow-800';
      case 'Fully Paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddPayment = (offerId: string) => {
    console.log(`Adding payment for offer ${offerId}:`, newPayment);
    setShowAddPayment(null);
    setNewPayment({ amount: '', comment: '', method: 'Bank Transfer' });
  };

  const totalReceivable = filteredOffers.reduce((sum, offer) => sum + offer.totalPrice, 0);
  const totalReceived = filteredOffers.reduce((sum, offer) => sum + offer.totalPaid, 0);
  const totalOutstanding = totalReceivable - totalReceived;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Uplate</h1>
          <p className="text-gray-600 mt-1">Prati i upravljaj uplatama klijenata za prihvaćene ponude</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Download className="w-4 h-4 mr-2" />
          Izvezi u Excel
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ukupno za naplatu</p>
              <p className="text-2xl font-bold text-gray-900">€{totalReceivable.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Euro className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ukupno primljeno</p>
              <p className="text-2xl font-bold text-green-600">€{totalReceived.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Preostalo za naplatu</p>
              <p className="text-2xl font-bold text-red-600">€{totalOutstanding.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <Euro className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stopa naplate</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalReceivable > 0 ? Math.round((totalReceived / totalReceivable) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <History className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pretraga po nazivu ponude, šifri ili klijentu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filteri
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status uplate</label>
                <select
                  value={filters.paymentStatus}
                  onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Svi statusi uplate</option>
                  <option value="Not Paid">Nije plaćeno</option>
                  <option value="Partially Paid">Delimično plaćeno</option>
                  <option value="Fully Paid">Uplaćeno u celosti</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Klijent</label>
                <select
                  value={filters.client}
                  onChange={(e) => setFilters({...filters, client: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Svi klijenti</option>
                  <option value="ABC Travel Agency">ABC Travel Agency</option>
                  <option value="Global Adventures Inc.">Global Adventures Inc.</option>
                  <option value="Adventure Seekers Ltd.">Adventure Seekers Ltd.</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Datum od</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Datum do</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Ponuda</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Klijent</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Ukupan iznos</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Plaćeno</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Napredak</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {currentOffers.map((offer) => {
                const paymentPercentage = (offer.totalPaid / offer.totalPrice) * 100;
                const remaining = offer.totalPrice - offer.totalPaid;
                
                return (
                  <tr key={offer.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{offer.code}</p>
                        <p className="text-sm text-gray-600">{offer.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{offer.client}</p>
                          <p className="text-xs text-gray-500">{offer.numberOfPersons} persons</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900">€{offer.totalPrice.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-green-600">€{offer.totalPaid.toLocaleString()}</span>
                        {remaining > 0 && (
                          <p className="text-xs text-red-600">Preostalo: €{remaining.toLocaleString()}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{Math.round(paymentPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              paymentPercentage === 100 ? 'bg-green-600' : 
                              paymentPercentage > 0 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${paymentPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(offer.paymentStatus)}`}>
                        {offer.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowAddPayment(offer.id)}
                          className="flex items-center px-2 py-1 text-green-600 hover:bg-green-50 rounded text-sm transition-colors"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Dodaj uplatu
                        </button>
                        <button
                          onClick={() => setShowPaymentHistory(offer.id)}
                          className="flex items-center px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm transition-colors"
                        >
                          <History className="w-3 h-3 mr-1" />
                          Istorija
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Modal */}
      {showAddPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dodaj novu uplatu</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Iznos (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Način plaćanja</label>
                  <select
                    value={newPayment.method}
                    onChange={(e) => setNewPayment({...newPayment, method: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Bank Transfer">Bankovni transfer</option>
                    <option value="Credit Card">Kreditna kartica</option>
                    <option value="Cash">Gotovina</option>
                    <option value="Check">Ček</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Komentar</label>
                  <textarea
                    value={newPayment.comment}
                    onChange={(e) => setNewPayment({...newPayment, comment: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Beleške o uplati..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddPayment(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Otkaži
                </button>
                <button
                  onClick={() => handleAddPayment(showAddPayment)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Dodaj uplatu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment History Modal */}
      {showPaymentHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Istorija uplata</h3>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {(() => {
                const offer = offers.find(o => o.id === showPaymentHistory);
                return offer?.payments.length ? (
                  <div className="space-y-4">
                    {offer.payments.map((payment) => (
                      <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-green-600">€{payment.amount.toLocaleString()}</span>
                          <span className="text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{payment.comment}</p>
                        <p className="text-xs text-gray-500">Metod: {payment.method}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Još uvek nema zabeleženih uplata</p>
                );
              })()}
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPaymentHistory(null)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Zatvori
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Prikazano {startIndex + 1} do {Math.min(startIndex + itemsPerPage, filteredOffers.length)} od ukupno {filteredOffers.length} ponuda
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prethodna
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sledeća
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}