import React from "react";
import { OfferFormData, HotelEntry, RoomTypeEntry } from "../../../../types/offer";
import { Bed, ChevronDown, ChevronUp, Euro, Plus, Trash2, X } from "lucide-react";
import { useCMS } from "../../../../contexts/CMSContext";

type Props = {
  formData: OfferFormData;
  stats: {
    totalNights: number;
    totalPersons: number;
    totalCost: number;
    canAddHotel: boolean;
    remainingNights: number;
    remainingPersons: number;
  };
  expanded: boolean;
  onToggle: () => void;
  addHotel: () => void;
  updateHotel: (hotelId: string, updates: Partial<HotelEntry>) => void;
  removeHotel: (hotelId: string) => void;
  addRoomType: (hotelId: string) => void;
  updateRoomType: (hotelId: string, roomTypeId: string, updates: Partial<RoomTypeEntry>) => void;
  removeRoomType: (hotelId: string, roomTypeId: string) => void;
  canAddRoomType: (hotelId: string) => boolean;
  setAccommodationEnabled: (value: boolean) => void;
};

export default function AccommodationSection(props: Props) {
  const {
    formData,
    stats,
    expanded,
    onToggle,
    addHotel,
    updateHotel,
    removeHotel,
    addRoomType,
    updateRoomType,
    removeRoomType,
    canAddRoomType,
    setAccommodationEnabled,
  } = props;

  const { hotels } = useCMS();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bed className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Smeštaj</h2>
              <p className="text-sm text-gray-600 mt-1">Upravljaj boravcima u hotelima i raspodelom soba</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-700 mr-3">Omogući smeštaj</label>
              <button
                type="button"
                onClick={() => setAccommodationEnabled(!formData.accommodationEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.accommodationEnabled ? "bg-blue-600" : "bg-gray-200"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.accommodationEnabled ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
            <button onClick={onToggle} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {expanded && formData.accommodationEnabled && (
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalNights}</div>
              <div className="text-sm text-gray-600">Ukupno noćenja</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.remainingNights}</div>
              <div className="text-sm text-gray-600">Preostala noćenja</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalPersons}</div>
              <div className="text-sm text-gray-600">Dodeljene osobe</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">€{stats.totalCost.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Cena</div>
            </div>
          </div>

          <div className="space-y-6">
            {formData.hotels.map((hotel, hotelIndex) => {
              const selectedHotel = hotels.find((h) => h.id === hotel.hotelId);
              const hotelPersons = hotel.roomTypes.reduce((sum, room) => sum + room.numberOfPersons, 0);
              return (
                <div key={hotel.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Hotel {hotelIndex + 1}
                      {selectedHotel && <span className="text-blue-600 ml-2">- {selectedHotel.name}</span>}
                    </h3>
                    <button type="button" onClick={() => removeHotel(hotel.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove hotel">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Izaberi hotel <span className="text-red-500">*</span></label>
                      <select
                        value={hotel.hotelId}
                        onChange={(e) => updateHotel(hotel.id, { hotelId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Izaberi hotel...</option>
                        {hotels.map((h) => (
                          <option key={h.id} value={h.id}>{h.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Datum prijave <span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        value={hotel.checkIn}
                        min={formData.startDate}
                        max={formData.endDate}
                        onChange={(e) => updateHotel(hotel.id, { checkIn: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Datum odjave <span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        value={hotel.checkOut}
                        min={hotel.checkIn || formData.startDate}
                        max={formData.endDate}
                        onChange={(e) => updateHotel(hotel.id, { checkOut: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {hotel.checkIn && hotel.checkOut && (
                    <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-700">
                          <strong>{hotel.nights}</strong> noćenja ({new Date(hotel.checkIn).toLocaleDateString()} - {new Date(hotel.checkOut).toLocaleDateString()})
                        </span>
                        <span className="text-blue-700"><strong>{hotelPersons}</strong> dodeljenih osoba</span>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-semibold text-gray-900">Tipovi soba</h4>
                      <button
                        type="button"
                        onClick={() => addRoomType(hotel.id)}
                        disabled={!canAddRoomType(hotel.id)}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Dodaj tip sobe
                      </button>
                    </div>

                    {hotel.roomTypes.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Bed className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>Još uvek nisu dodati tipovi soba</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {hotel.roomTypes.map((roomType, roomIndex) => {
                          const selectedHotelData = hotels.find((h) => h.id === hotel.hotelId);
                          const selectedRoomType = selectedHotelData?.roomTypes.find((rt) => rt.id === roomType.roomTypeId);
                          return (
                            <div key={roomType.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-medium text-gray-900">
                                  Tip sobe {roomIndex + 1}
                                  {selectedRoomType && <span className="text-gray-600 ml-2">- {selectedRoomType.name}</span>}
                                </h5>
                                <button
                                  type="button"
                                  onClick={() => removeRoomType(hotel.id, roomType.id)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                  title="Remove room type"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tip sobe <span className="text-red-500">*</span>
                                  </label>
                                  <select
                                    value={roomType.roomTypeId}
                                    onChange={(e) => updateRoomType(hotel.id, roomType.id, { roomTypeId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    required
                                  >
                                    <option value="">Izaberi tip sobe...</option>
                                    {selectedHotelData?.roomTypes.map((rt) => (
                                      <option key={rt.id} value={rt.id}>{rt.name}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Osoba <span className="text-red-500">*</span></label>
                                  <input
                                    type="number"
                                    min={1}
                                    value={roomType.numberOfPersons}
                                    onChange={(e) => updateRoomType(hotel.id, roomType.id, { numberOfPersons: parseInt(e.target.value) || 1 })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Cena po noćenju po osobi <span className="text-red-500">*</span></label>
                                  <div className="relative">
                                    <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                      type="number"
                                      min={0}
                                      step="0.01"
                                      value={roomType.pricePerNightPerPerson}
                                      onChange={(e) => updateRoomType(hotel.id, roomType.id, { pricePerNightPerPerson: parseFloat(e.target.value) || 0 })}
                                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                      required
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Komentar</label>
                                  <input
                                    type="text"
                                    value={roomType.comment}
                                    onChange={(e) => updateRoomType(hotel.id, roomType.id, { comment: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    placeholder="Excel comment"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Ukupna cena</label>
                                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-900">
                                    €{roomType.totalCost.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Boravišna taksa</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cena po osobi po danu</label>
                        <div className="relative">
                          <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={hotel.cityTax.pricePerPersonPerDay}
                            onChange={(e) => updateHotel(hotel.id, { cityTax: { ...hotel.cityTax, pricePerPersonPerDay: parseFloat(e.target.value) || 0 } })}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Komentar</label>
                        <input
                          type="text"
                          value={hotel.cityTax.comment}
                          onChange={(e) => updateHotel(hotel.id, { cityTax: { ...hotel.cityTax, comment: e.target.value } })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Excel comment"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ukupno - Boravišna taksa</label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-900">
                          €{(hotel.nights * hotelPersons * hotel.cityTax.pricePerPersonPerDay).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Hotel - Ukupno:</span>
                      <span className="text-xl font-bold text-blue-600">€{hotel.subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={addHotel}
              disabled={!stats.canAddHotel}
              className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              {stats.canAddHotel ? `Dodaj hotel (${stats.remainingNights} noćenja preostalo)` : "Sva noćenja su dodeljena"}
            </button>
          </div>
        </div>
      )}

      {expanded && !formData.accommodationEnabled && (
        <div className="p-6 text-center text-gray-500">
          <Bed className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Smeštaj je onemogućen za ovu ponudu</p>
        </div>
      )}
    </div>
  );
}


