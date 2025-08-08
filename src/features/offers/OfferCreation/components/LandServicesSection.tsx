import React from "react";
import { OfferFormData, DayService, ServiceEntry } from "../../../../types/offer";
import { ChevronDown, ChevronUp, Clock, Euro, Plus, Trash2 } from "lucide-react";
import { MapPin as ServiceIcon } from "lucide-react";

type Props = {
  formData: OfferFormData;
  stats: { totalCost: number; totalServices: number; daysWithServices: number };
  expanded: boolean;
  onToggle: () => void;
  setLandServicesEnabled: (value: boolean) => void;
  updateDayService: (dayId: string, updates: Partial<DayService>) => void;
  addServiceToDay: (dayId: string) => void;
  updateService: (dayId: string, serviceId: string, updates: Partial<ServiceEntry>) => void;
  removeService: (dayId: string, serviceId: string) => void;
  getServiceOptions: (serviceType: string) => { id: string; name: string }[];
  getCMSEntity: (serviceType: string, serviceId: string) => any;
  getServiceTypeName: (serviceType: string) => string;
};

export default function LandServicesSection(props: Props) {
  const {
    formData,
    stats,
    expanded,
    onToggle,
    setLandServicesEnabled,
    updateDayService,
    addServiceToDay,
    updateService,
    removeService,
    getServiceOptions,
    getCMSEntity,
    getServiceTypeName,
  } = props;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ServiceIcon className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Usluge po danima</h2>
              <p className="text-sm text-gray-600 mt-1">Definiši usluge za svaki dan ponude</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-700 mr-3">Omogući usluge po danima</label>
              <button
                type="button"
                onClick={() => setLandServicesEnabled(!formData.landServicesEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.landServicesEnabled ? "bg-blue-600" : "bg-gray-200"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.landServicesEnabled ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            <button onClick={onToggle} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {expanded && formData.landServicesEnabled && (
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalServices}</div>
              <div className="text-sm text-gray-600">Ukupno usluga</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.daysWithServices}</div>
              <div className="text-sm text-gray-600">Dani sa uslugama</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">€{stats.totalCost.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Ukupna cena</div>
            </div>
          </div>

          <div className="space-y-6">
            {formData.landServices.map((day) => (
              <div key={day.id} className="border border-gray-200 rounded-lg bg-gray-50">
                <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-gray-900">
                          {new Date(day.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={day.dayTitle}
                          onChange={(e) => updateDayService(day.id, { dayTitle: e.target.value })}
                          className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Day title for PDF/Excel"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-600">
                        Ukupno: <span className="text-blue-600">€{day.subtotal.toFixed(2)}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => addServiceToDay(day.id)}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Dodaj uslugu
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  {day.services.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ServiceIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Nema dodatih usluga za ovaj dan</p>
                      <p className="text-sm">Ovaj dan neće biti prikazan u eksportima</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {day.services.map((service, index) => {
                        const serviceOptions = getServiceOptions(service.serviceType);
                        const selectedService = getCMSEntity(service.serviceType, service.serviceId);
                        return (
                          <div key={service.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900">
                                Usluga {index + 1}
                                {selectedService && <span className="text-blue-600 ml-2">- {selectedService.name}</span>}
                              </h4>
                              <button
                                type="button"
                                onClick={() => removeService(day.id, service.id)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                title="Remove service"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tip usluge <span className="text-red-500">*</span></label>
                                <select
                                  value={service.serviceType}
                                  onChange={(e) =>
                                    updateService(day.id, service.id, { serviceType: e.target.value as ServiceEntry["serviceType"], serviceId: "" })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  required
                                >
                                  <option value="activity">Aktivnost</option>
                                  <option value="restaurant">Restoran</option>
                                  <option value="guide">Vodič</option>
                                  <option value="translator">Prevodilac</option>
                                  <option value="transport">Prevoz</option>
                                  <option value="gift">Poklon</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Naziv usluge <span className="text-red-500">*</span></label>
                                <select
                                  value={service.serviceId}
                                  onChange={(e) => updateService(day.id, service.id, { serviceId: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  required
                                >
                                  <option value="">Izaberi {getServiceTypeName(service.serviceType)}...</option>
                                  {serviceOptions.map((opt) => (
                                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Osobe/Jedinice <span className="text-red-500">*</span></label>
                                <input
                                  type="number"
                                  min={1}
                                  value={service.quantityPersons}
                                  onChange={(e) => updateService(day.id, service.id, { quantityPersons: parseInt(e.target.value) || 1 })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Broj dana <span className="text-red-500">*</span></label>
                                <input
                                  type="number"
                                  min={1}
                                  value={service.quantityDays}
                                  onChange={(e) => updateService(day.id, service.id, { quantityDays: parseInt(e.target.value) || 1 })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cena osoba dan <span className="text-red-500">*</span></label>
                                <div className="relative">
                                  <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={service.pricePerDayPerPerson}
                                    onChange={(e) => updateService(day.id, service.id, { pricePerDayPerPerson: parseFloat(e.target.value) || 0 })}
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    required
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ukupno</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-900">€{service.subtotal.toFixed(2)}</div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Komentar (Excel Export)</label>
                              <textarea
                                value={service.comment}
                                onChange={(e) => updateService(day.id, service.id, { comment: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="Komentar za Excel izvoz (automatski popunjen iz CMS-a)"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {expanded && !formData.landServicesEnabled && (
        <div className="p-6 text-center text-gray-500">
          <ServiceIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Usluge po danima su onemogućene za ovu ponudu</p>
        </div>
      )}
    </div>
  );
}


