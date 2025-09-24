import React, { useEffect } from "react";
import { useCMS } from "../../contexts/CMSContext";
import { useOfferForm } from "./hooks/useOfferForm";
import { useExpenses } from "./hooks/useExpenses";
import { useSlides } from "./hooks/useSlides";
import GeneralInfoSection from "./GeneralInfoSection";
import AccommodationSection from "./AccommodationSection";
import LandServicesSection from "./LandServicesSection";
import StickySummaryBar from "./StickySummaryBar";
import ExpensesModal from "./ExpensesModal";
import SlidesModal from "./SlidesModal";
import AddSlideModal from "./AddSlideModal";
import EditSlideModal from "./EditSlideModal";
import NewClientModal from "./NewClientModal";
import { getServiceTypeName } from "./utils/constants";
import { useLocation, useNavigate } from "react-router-dom";
import { mapOffer, mapOfferToForm } from "../../utils/offer_response_mappers";
import { exportOffer } from "../../api/export";
import { BACKEND_URL } from "../../config";

export default function OfferCreation() {
  const cms = useCMS();

  const {
    formData,
    setFormData,
    errors,
    handleInputChange,
    accommodationStats,
    addHotel,
    updateHotel,
    removeHotel,
    addRoomType,
    updateRoomType,
    removeRoomType,
    canAddRoomType,
    updateDayService,
    addServiceToDay,
    updateService,
    removeService,
    getServiceOptions,
    getCMSEntity,
    landServicesStats,
    totalOfferCost,
    pricePerPerson,
  } = useOfferForm(cms as any);

  const location = useLocation();
  const navigate = useNavigate();

  const incoming = (location.state as any)?.offer;
  const initialOfferId = incoming?.id ?? null;

  const [isEdit, setIsEdit] = React.useState(!!incoming);
  const [editOfferId, setEditOfferId] = React.useState<string | null>(initialOfferId);

  const [accommodationExpanded, setAccommodationExpanded] =
    React.useState(true);
  const [landServicesExpanded, setLandServicesExpanded] = React.useState(true);
  const [expensesModalOpen, setExpensesModalOpen] = React.useState(false);
  const [showNewClientModal, setShowNewClientModal] = React.useState(false);

  const {
    slides,
    setSlides,
    editingSlide,
    setEditingSlide,
    showAddSlideModal,
    setShowAddSlideModal,
    newSlideType,
    setNewSlideType,
    draggedSlide,
    setDraggedSlide,
    showPDFModal,
    setShowPDFModal,
    handleSlideReorder,
    handleDeleteSlide,
    addSlide,
    saveSlidesHandler
  } = useSlides(editOfferId);

  const {
    expenses,
    detectedEntities,
    updateDetectedEntity,
    handleAddCustomExpense,
    handleUpdateExpense,
    handleRemoveExpense,
  } = useExpenses(
    cms as any,
    {
      accommodationEnabled: formData.accommodationEnabled,
      hotels: formData.hotels,
      landServicesEnabled: formData.landServicesEnabled,
      landServices: formData.landServices,
      offerId: Number(editOfferId)
    },
    expensesModalOpen
  );

  useEffect(() => {
    const incoming = (location.state as any)?.offer;

    if (incoming) {
      setIsEdit(true);
      setEditOfferId(incoming.id ?? incoming._id ?? null);
      // incoming is already OfferFormData
      setFormData(incoming);
    }
  }, [location.state, location.search]);


  const handleSaveOffer = async () => {
  if (!formData.clientId) {
    alert("Please select a client before saving");
    return;
  }

  console.log("PONUDA HOTEL " + JSON.stringify(formData.hotels))

  console.log("FORM " + JSON.stringify(formData))
  const payload = {
    sifra: formData.offerCode ?? null,
    naziv: formData.offerName,
    klijent_id: formData.clientId,
    korisnik_id: 1,
    lokacija: formData.location ?? null,
    broj_osoba: formData.numberOfPersons ?? null,
    datum_od: formData.startDate ?? null,
    datum_do: formData.endDate ?? null,
    opis: formData.option ?? null,
    ukljucuje_smestaj: formData.accommodationEnabled,
    ukljucuje_usluge: formData.landServicesEnabled,
    smestaj: formData.hotels.flatMap(h =>
      h.roomTypes.map(rt => ({
        hotel_id: Number(h.hotelId),
        tip_sobe: Number(rt.roomTypeId),
        broj_osoba: rt.numberOfPersons,
        broj_dana: h.nights,
        datum_od: h.checkIn,
        datum_do: h.checkOut,
        boravisna_taksa: h.cityTax.pricePerPersonPerDay,
        cena_po_danu_po_osobi: rt.pricePerNightPerPerson,
        komentar: rt.comment ?? h.cityTax.comment ?? null,
      }))
    ),
    usluge_po_danu: formData.landServices.reduce((acc: any, day: any) => {
      // Ako nema usluga za taj dan, postavi prazan niz (ne prazan objekat!)
      acc[day.date] = (day.services && day.services.length > 0)
        ? day.services.map((s: any) => ({
            datum: day.date,
            usluga_id: parseInt(s.serviceId, 10),
            broj_osoba: s.quantityPersons,
            broj_dana: s.quantityDays,
            cena_po_danu_po_osobi: s.pricePerDayPerPerson,
            komentar: s.comment ?? null,
          }))
        : [];
      return acc;
    }, {})
  };

    console.log(JSON.stringify(payload));
  try {
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit && editOfferId
    ? `${BACKEND_URL}/ponuda/${editOfferId}`
    : `${BACKEND_URL}/ponuda`;


    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`${isEdit ? "update" : "create"} failed: ${res.status}`);
    }

    const returned = await res.json();
    
    const mappedReturned = mapOffer(returned);

    const start = new Date(mappedReturned.startDate);
    const end = new Date(mappedReturned.endDate);

    const allDates: string[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      allDates.push(d.toISOString().slice(0, 10)); // YYYY-MM-DD
    }

    mappedReturned.dailyServices = allDates.map(date => {
      const existingDay = mappedReturned.dailyServices.find((d: any) => d.date === date);
      if (existingDay) return existingDay;

      return {
        date,
        dayName: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
        serviceId: 0,
        serviceName: '',
        serviceType: '',
        numberOfPersons: 0,
        numberOfDays: 0,
        pricePerDayPerPerson: 0,
        comment: '',
      };
    });

    mappedReturned.dailyServices.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    mappedReturned.accommodation = mappedReturned.accommodation.map((h: any) => ({
      ...h,
      roomTypes: h.roomTypes.sort((a: any, b: any) => new Date(a.datum_od).getTime() - new Date(b.datum_od).getTime())
    }));
    
    setFormData(mapOfferToForm(mappedReturned));

    alert(isEdit ? "Offer updated successfully!" : "Offer saved successfully!");
    console.log(isEdit ? "Updated offer:" : "Created offer:", returned);

    //navigate("/offers"); 
  } catch (err) {
    console.error(err);
    alert(isEdit ? "Failed to update offer!" : "Failed to create offer!");
  }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? "Izmeni ponudu" : "Kreiraj novu ponudu"}
          </h1>

          <p className="text-gray-600 mt-1">
            Kreiraj detaljnu turističku ponudu za klijenta
          </p>
        </div>
      </div>

      <GeneralInfoSection
        formData={formData}
        errors={errors}
        clients={cms.clients}
        onChange={handleInputChange}
        onOpenNewClient={() => setShowNewClientModal(true)}
      />

      <AccommodationSection
        formData={formData}
        stats={accommodationStats}
        expanded={accommodationExpanded}
        onToggle={() => setAccommodationExpanded((v) => !v)}
        addHotel={addHotel}
        updateHotel={updateHotel}
        removeHotel={removeHotel}
        addRoomType={addRoomType}
        updateRoomType={updateRoomType}
        removeRoomType={removeRoomType}
        canAddRoomType={canAddRoomType}
        setAccommodationEnabled={(enabled) =>
          handleInputChange("accommodationEnabled", enabled)
        }
      />

      <LandServicesSection
        formData={formData}
        stats={landServicesStats}
        expanded={landServicesExpanded}
        onToggle={() => setLandServicesExpanded((v) => !v)}
        setLandServicesEnabled={(enabled) =>
          handleInputChange("landServicesEnabled", enabled)
        }
        updateDayService={updateDayService}
        addServiceToDay={addServiceToDay}
        updateService={updateService}
        removeService={removeService}
        getServiceOptions={getServiceOptions}
        getCMSEntity={getCMSEntity}
        getServiceTypeName={getServiceTypeName}
      />

      <StickySummaryBar
        totalOfferCost={totalOfferCost}
        pricePerPerson={pricePerPerson}
        numberOfPersons={formData.numberOfPersons}
        onOpenExpenses={() => setExpensesModalOpen(true)}
        onExportExcel={() => {
          if (!editOfferId) {
            alert("Ponuda još nije sačuvana, prvo sačuvaj pa onda eksportuj.");
            return;
          }
          exportOffer(Number(editOfferId));
        }}
        onOpenPDF={() => setShowPDFModal(true)}
        onSave={handleSaveOffer}
      />

      <ExpensesModal
        open={expensesModalOpen}
        offerId={editOfferId}
        onClose={() => setExpensesModalOpen(false)}
        detectedEntities={detectedEntities}
        updateDetectedEntity={updateDetectedEntity}
        expenses={expenses} // <--- koristi state iz hook-a
        onAddCustomExpense={handleAddCustomExpense}
        onUpdateExpense={handleUpdateExpense}
        onRemoveExpense={handleRemoveExpense}
      />


      <SlidesModal
        open={showPDFModal}
        onClose={() => setShowPDFModal(false)}
        slides={slides}
        setSlides={setSlides}
        draggedSlide={draggedSlide}
        setDraggedSlide={setDraggedSlide}
        onReorder={handleSlideReorder}
        onEdit={(s) => setEditingSlide(s)}
        onDelete={handleDeleteSlide}
        onOpenAdd={() => setShowAddSlideModal(true)}
        onSave={() => saveSlidesHandler()}
      />

      <AddSlideModal
        open={showAddSlideModal}
        onClose={() => setShowAddSlideModal(false)}
        newSlideType={newSlideType}
        setNewSlideType={setNewSlideType}
        onAdd={() => addSlide()}
      />

      <EditSlideModal
        slide={editingSlide}
        onClose={() => setEditingSlide(null)}
        onSave={(updated) => {
          setSlides(slides.map((s) => (s.id === updated.id ? updated : s)));
          setEditingSlide(null);
        }}
      />

      <NewClientModal
        open={showNewClientModal}
        onClose={() => setShowNewClientModal(false)}
        onCreated={(client) =>
          setFormData((prev: any) => ({ ...prev, clientId: client.id }))
        }
      />
    </div>
  );
}