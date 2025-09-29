import React, { useMemo } from "react";
import { OfferDetailed } from "../types";
import { groupAccommodation, groupServices } from "../../../../utils/offer_response_mappers";
import { Bed, ConciergeBell, Calendar } from "lucide-react"; 

interface OfferViewCardProps {
  offer: OfferDetailed;
  onClose: () => void;
}

export const OfferViewCard: React.FC<OfferViewCardProps> = ({ offer, onClose }) => {
  if (!offer) return null;

  // Prepare grouped data
  const groupedAccommodation = useMemo(
    () => groupAccommodation(offer.accommodation || []),
    [offer.accommodation]
  );
  const groupedServices = useMemo(
    () => groupServices(offer.dailyServices || []),
    [offer.dailyServices]
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-2">{offer.name}</h2>
        <p className="text-gray-600 mb-2">Šifra: {offer.code}</p>
        <p className="text-gray-600 mb-2">Status: {offer.status}</p>
        <p className="text-gray-600 mb-2">Lokacija: {offer.location || "-"}</p>
        <p className="text-gray-600 mb-2">Broj osoba: {offer.numberOfPersons}</p>
        <p className="text-gray-600 mb-4">
          Datum: {formatDateMDY(offer.startDate)} - {formatDateMDY(offer.endDate)}
        </p>

        <p className="text-gray-700 mb-1">
          Cena po osobi (bez PDV): €{offer.pricePerPerson?.toFixed(2) || "-"}
        </p>
        <p className="text-gray-700 mb-4">
          Cena po osobi (sa PDV): €{offer.pricePerPersonVat?.toFixed(2) || "-"}
        </p>

        {/* Smještaj */}
        {offer.accommodation?.length > 0 && (
          <div className="mb-6">
            <h3 className="flex items-center text-xl font-semibold mb-2">
              <Bed className="w-5 h-5 mr-2 text-gray-700" />
              Smeštaj
            </h3>
            {Object.entries(groupedAccommodation).map(([dateRange, hotels]) => (
              <div key={dateRange} className="ml-4 mb-4">
                <p className="flex items-center font-semibold text-gray-700">
                  <Calendar className="w-4 h-4 mr-2" /> {formatDateRangeMDY(dateRange)}
                </p>
                {Object.entries(hotels).map(([hotelName, rooms]) => (
                  <div key={hotelName} className="ml-6 mb-2">
                    <p className="text-gray-800 font-medium">Hotel: {hotelName}</p>
                    {rooms.map((room, i) => (
                      <div key={i} className="ml-8 border p-2 rounded mb-1">
                        <p>Tip sobe: {room.roomTypeName}</p>
                        <p>Broj osoba: {room.numberOfPersons}</p>
                        <p>Cena po danu: €{room.pricePerDay}</p>
                        <p>Boravišna taksa: €{room.touristTax}</p>
                        <p>Komentar: {room.comment || "-"}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Usluge po danu */}
        {offer.dailyServices?.length > 0 && (
          <div className="mb-6">
            <h3 className="flex items-center text-xl font-semibold mb-2">
              <ConciergeBell className="w-5 h-5 mr-2 text-gray-700" />
              Usluge po danu
            </h3>
            {Object.entries(groupedServices).map(([date, services]) => (
              <div key={date} className="ml-4 mb-4">
                <p className="flex items-center font-semibold text-gray-700">
                  <Calendar className="w-4 h-4 mr-2" /> {formatDateMDY(date)}
                </p>
                {services.map((s, i) => (
                  <div key={i} className="ml-6 border p-2 rounded mb-1">
                    <p>Naziv: {s.serviceId}</p>
                    <p>Broj osoba: {s.numberOfPersons}</p>
                    <p>Broj dana: {s.numberOfDays}</p>
                    <p>Cena po osobi/danu: €{s.pricePerDayPerPerson}</p>
                    <p>Komentar: {s.comment || "-"}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Format date as MM/DD/YYYY
function formatDateMDY(dateString: string): string {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// Format date range like "start - end" as MM/DD/YYYY - MM/DD/YYYY
function formatDateRangeMDY(dateRange: string): string {
  const [start, end] = dateRange.split(" - ");
  return `${formatDateMDY(start)} - ${formatDateMDY(end)}`;
}
