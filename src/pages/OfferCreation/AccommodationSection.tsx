import React, { useState } from "react";
import { OfferFormData, HotelEntry, RoomTypeEntry } from "../../types/offer";
import { Bed, ChevronDown, ChevronUp, Euro, Plus, Trash2, X } from "lucide-react";
import { useCMS } from "../../contexts/CMSContext";

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
  updateRoomType: (
    hotelId: string,
    roomTypeId: string,
    updates: Partial<RoomTypeEntry>
  ) => void;
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

  const [hotelDropdownVisible, setHotelDropdownVisible] = useState<{ [key: string]: boolean }>({});
  const [hotelInput, setHotelInput] = useState<{ [key: string]: string }>({});

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* HEADER */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bed className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Smeštaj</h2>
              <p className="text-sm text-gray-600 mt-1">
                Upravljaj boravcima u hotelima i raspodelom soba
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-700 mr-3">
                Omogući smeštaj
              </label>
              <button
                type="button"
                onClick={() =>
                  setAccommodationEnabled(!formData.accommodationEnabled)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.accommodationEnabled ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.accommodationEnabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <button
              onClick={onToggle}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {expanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* KADA JE OTVORENO I OMOGUĆENO */}
      {expanded && formData.accommodationEnabled && (
        <div className="p-6 space-y-6">
          {/* STATS BLOK */}
          <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalNights}
              </div>
              <div className="text-sm text-gray-600">Ukupno noćenja</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.remainingNights}
              </div>
              <div className="text-sm text-gray-600">Preostala noćenja</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalPersons}
              </div>
              <div className="text-sm text-gray-600">Dodeljene osobe</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                €{stats.totalCost.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Cena</div>
            </div>
          </div>

          {/* LISTA HOTELA */}
          {formData.hotels.map((hotel, hotelIndex) => {
            const selectedHotel = hotels.find((h) => h.id === hotel.hotelId);
            const hotelPersons = hotel.roomTypes.reduce(
              (sum, room) => sum + room.numberOfPersons,
              0
            );

            return (
              <div key={hotel.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4">
                {/* HEADER HOTELA */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Hotel {hotelIndex + 1}
                    {selectedHotel && <span className="text-blue-600 ml-2">- {selectedHotel.name}</span>}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeHotel(hotel.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* AUTOCOMPLETE */}
                <div className="relative">
                  <label className="block text-sm font-medium mb-1">Pretraži hotel *</label>
                  <input
                    type="text"
                    placeholder="Kucaj da pretražiš hotel..."
                    value={hotelInput[hotel.id] ?? selectedHotel?.name ?? ""}
                    onChange={(e) => {
                      setHotelInput(prev => ({ ...prev, [hotel.id]: e.target.value }));
                      setHotelDropdownVisible(prev => ({ ...prev, [hotel.id]: true }));
                      updateHotel(hotel.id, { hotelId: "" });
                    }}
                    onFocus={() => setHotelDropdownVisible(prev => ({ ...prev, [hotel.id]: true }))}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  {hotelDropdownVisible[hotel.id] && (
                    <ul className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-lg mt-1 shadow-lg text-sm">
                      {hotels
                        .filter(h => h.name.toLowerCase().includes((hotelInput[hotel.id] ?? "").toLowerCase()))
                        .map(h => (
                          <li
                            key={h.id}
                            className="px-3 py-1 hover:bg-blue-50 cursor-pointer"
                            onClick={() => {
                              updateHotel(hotel.id, { hotelId: h.id });
                              setHotelInput(prev => ({ ...prev, [hotel.id]: h.name }));
                              setHotelDropdownVisible(prev => ({ ...prev, [hotel.id]: false }));
                            }}
                          >
                            {h.name}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>

                {/* DATUMI */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block mb-1 font-medium">Datum prijave *</label>
                    <input
                      type="date"
                      value={hotel.checkIn}
                      min={formData.startDate}
                      max={formData.endDate}
                      onChange={(e) => updateHotel(hotel.id, { checkIn: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Datum odjave *</label>
                    <input
                      type="date"
                      value={hotel.checkOut}
                      min={hotel.checkIn || formData.startDate}
                      max={formData.endDate}
                      onChange={(e) => updateHotel(hotel.id, { checkOut: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* INFO */}
                {hotel.checkIn && hotel.checkOut && (
                  <div className="p-2 bg-blue-50 rounded text-sm text-blue-700 flex justify-between">
                    <span>
                      <strong>{hotel.nights}</strong> noćenja (
                      {new Date(hotel.checkIn).toLocaleDateString()} -{" "}
                      {new Date(hotel.checkOut).toLocaleDateString()})
                    </span>
                    <span>
                      <strong>{hotelPersons}</strong> dodeljenih osoba
                    </span>
                  </div>
                )}

                {/* ROOM TYPES */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-semibold text-gray-900">Tipovi soba</h4>
                    <button
                      type="button"
                      onClick={() => addRoomType(hotel.id)}
                      disabled={!canAddRoomType(hotel.id)}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
                        const selectedRoomType =
                          selectedHotelData?.roomTypes.find((rt) => rt.id === roomType.roomTypeId);
                        return (
                          <div key={roomType.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-medium text-gray-900">
                                Tip sobe {roomIndex + 1}
                                {selectedRoomType && (
                                  <span className="text-gray-600 ml-2">- {selectedRoomType.name}</span>
                                )}
                              </h5>
                              <button
                                type="button"
                                onClick={() => removeRoomType(hotel.id, roomType.id)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                              {/* Tip sobe */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tip sobe *</label>
                                <select
                                  value={roomType.roomTypeId}
                                  onChange={(e) =>
                                    updateRoomType(hotel.id, roomType.id, {
                                      roomTypeId: e.target.value,
                                      roomTypeName: selectedRoomType?.name,
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                  required
                                >
                                  <option value="">Izaberi tip sobe...</option>
                                  {selectedHotelData?.roomTypes.map((rt) => (
                                    <option key={rt.id} value={rt.id}>
                                      {rt.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {/* Osoba */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Osoba *</label>
                                <input
                                  type="number"
                                  min={1}
                                  value={roomType.numberOfPersons}
                                  onWheelCapture={(e) => (e.currentTarget as HTMLInputElement).blur()}
                                  onChange={(e) =>
                                    updateRoomType(hotel.id, roomType.id, {
                                      numberOfPersons: parseInt(e.target.value) || 1,
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                  required
                                />
                              </div>
                              {/* Cena */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cena *</label>
                                <div className="relative">
                                  <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    onWheelCapture={(e) => (e.currentTarget as HTMLInputElement).blur()}
                                    value={roomType.pricePerNightPerPerson}
                                    onChange={(e) =>
                                      updateRoomType(hotel.id, roomType.id, {
                                        pricePerNightPerPerson: parseFloat(e.target.value) || 0,
                                      })
                                    }
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                    required
                                  />
                                </div>
                              </div>
                              {/* Komentar */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Komentar</label>
                                <input
                                  type="text"
                                  value={roomType.comment}
                                  onChange={(e) =>
                                    updateRoomType(hotel.id, roomType.id, { comment: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                              </div>
                              {/* Ukupno */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ukupno</label>
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

                {/* BORAVIŠNA TAKSA */}
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
                          onWheelCapture={(e) => (e.currentTarget as HTMLInputElement).blur()}
                          step="0.01"
                          value={hotel.cityTax.pricePerPersonPerDay}
                          onChange={(e) =>
                            updateHotel(hotel.id, {
                              cityTax: { ...hotel.cityTax, pricePerPersonPerDay: parseFloat(e.target.value) || 0 },
                            })
                          }
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Komentar</label>
                      <input
                        type="text"
                        value={hotel.cityTax.comment}
                        onChange={(e) =>
                          updateHotel(hotel.id, { cityTax: { ...hotel.cityTax, comment: e.target.value } })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ukupno</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-900">
                        €
                        {(hotel.nights * hotelPersons * hotel.cityTax.pricePerPersonPerDay).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* HOTEL TOTAL */}
                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Hotel - Ukupno:</span>
                  <span className="text-xl font-bold text-blue-600">€{hotel.subtotal.toFixed(2)}</span>
                </div>
              </div>
            );
          })}

          {/* ADD HOTEL */}
          <div className="mt-6">
            <button
              type="button"
              onClick={addHotel}
              disabled={!stats.canAddHotel}
              className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5 mr-2" />
              {stats.canAddHotel
                ? `Dodaj hotel (${stats.remainingNights} noćenja preostalo)`
                : "Sva noćenja su dodeljena"}
            </button>
          </div>
        </div>
      )}

      {/* KADA JE SMEŠTAJ ISKLJUČEN */}
      {expanded && !formData.accommodationEnabled && (
        <div className="p-6 text-center text-gray-500">
          <Bed className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Smeštaj je onemogućen za ovu ponudu</p>
        </div>
      )}
    </div>
  );
}
