import React from "react";
import { OfferFormData } from "../../../../types/offer";
import { Building2, FileText, MapPin, Users, Calendar, Plus, AlertCircle } from "lucide-react";
import { Client } from "../../../../types/cms";

type Props = {
  formData: OfferFormData;
  errors: Record<string, string>;
  clients: Client[];
  onChange: (field: keyof OfferFormData, value: any) => void;
  onOpenNewClient: () => void;
};

export function GeneralInfoSection({ formData, errors, clients, onChange, onOpenNewClient }: Props) {
  const selectedClient = clients.find((c) => c.id === formData.clientId);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <FileText className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Opšte informacije</h2>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Naziv ponude <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.offerName}
              onChange={(e) => onChange("offerName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.offerName ? "border-red-300" : "border-gray-300"}`}
              placeholder="npr. Beogradsko kulturno iskustvo"
            />
            {errors.offerName && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.offerName}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Šifra ponude <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.offerCode}
              onChange={(e) => onChange("offerCode", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.offerCode ? "border-red-300" : "border-gray-300"}`}
              placeholder="npr. BEL-2024-001"
            />
            {errors.offerCode && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.offerCode}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Klijent <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              <select
                value={formData.clientId}
                onChange={(e) => onChange("clientId", e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.clientId ? "border-red-300" : "border-gray-300"}`}
              >
                <option value="">Izaberi klijenta...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.pib})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={onOpenNewClient}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Dodaj novog klijenta"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {errors.clientId && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.clientId}
              </div>
            )}
            {selectedClient && (
              <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                <div className="flex items-center text-sm text-blue-700">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span className="font-medium">{selectedClient.name}</span>
                  <span className="ml-2 text-blue-600">PIB: {selectedClient.pib}</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lokacija <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => onChange("location", e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.location ? "border-red-300" : "border-gray-300"}`}
                placeholder="npr. Belgrade, Serbia"
              />
            </div>
            {errors.location && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.location}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Broj osoba <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                min={1}
                value={formData.numberOfPersons}
                onChange={(e) => onChange("numberOfPersons", parseInt(e.target.value) || 1)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.numberOfPersons ? "border-red-300" : "border-gray-300"}`}
              />
            </div>
            {errors.numberOfPersons && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.numberOfPersons}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datum početka <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => onChange("startDate", e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.startDate ? "border-red-300" : "border-gray-300"}`}
              />
            </div>
            {errors.startDate && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.startDate}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datum završetka <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => onChange("endDate", e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.endDate ? "border-red-300" : "border-gray-300"}`}
              />
            </div>
            {errors.endDate && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.endDate}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Broj dana</label>
            <div className="relative">
              <input
                type="number"
                value={formData.numberOfDays}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                Auto-calculated
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Opcija (Dodatne napomene)</label>
            <textarea
              value={formData.option}
              onChange={(e) => onChange("option", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Bilo kakve dodatne napomene ili posebni zahtevi za ovu ponudu..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralInfoSection;


