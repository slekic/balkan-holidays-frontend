import React from "react";
import { useCMS } from "../contexts/CMSContext";
import { useOfferForm } from "../features/offers/OfferCreation/hooks/useOfferForm";
import { useExpenses } from "../features/offers/OfferCreation/hooks/useExpenses";
import { useSlides } from "../features/offers/OfferCreation/hooks/useSlides";
import GeneralInfoSection from "../features/offers/OfferCreation/components/GeneralInfoSection";
import AccommodationSection from "../features/offers/OfferCreation/components/AccommodationSection";
import LandServicesSection from "../features/offers/OfferCreation/components/LandServicesSection";
import StickySummaryBar from "../features/offers/OfferCreation/components/StickySummaryBar";
import ExpensesModal from "../features/offers/OfferCreation/components/ExpensesModal";
import SlidesModal from "../features/offers/OfferCreation/components/SlidesModal";
import AddSlideModal from "../features/offers/OfferCreation/components/AddSlideModal";
import EditSlideModal from "../features/offers/OfferCreation/components/EditSlideModal";
import NewClientModal from "../features/offers/OfferCreation/components/NewClientModal";
import { getServiceTypeName } from "../features/offers/OfferCreation/utils/constants";

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

  const [accommodationExpanded, setAccommodationExpanded] = React.useState(true);
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
  } = useSlides();

  const {
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
    },
    expensesModalOpen
  );

  const handleSaveOffer = () => {
    if (!formData.clientId) {
      alert("Please select a client before saving");
      return;
    }
    alert("Offer saved successfully!");
    console.log("Saving offer:", formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kreiraj novu ponudu</h1>
          <p className="text-gray-600 mt-1">Kreiraj detaljnu turističku ponudu za klijenta</p>
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
        setAccommodationEnabled={(enabled) => handleInputChange("accommodationEnabled", enabled)}
      />

      <LandServicesSection
        formData={formData}
        stats={landServicesStats}
        expanded={landServicesExpanded}
        onToggle={() => setLandServicesExpanded((v) => !v)}
        setLandServicesEnabled={(enabled) => handleInputChange("landServicesEnabled", enabled)}
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
          alert("Excel export functionality would be implemented here");
          console.log("Exporting Excel for offer:", formData);
        }}
        onOpenPDF={() => setShowPDFModal(true)}
        onSave={handleSaveOffer}
      />

      <ExpensesModal
        open={expensesModalOpen}
        onClose={() => setExpensesModalOpen(false)}
        detectedEntities={detectedEntities}
        updateDetectedEntity={updateDetectedEntity}
        expenses={[]}
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
        onCreated={(client) => setFormData((prev: any) => ({ ...prev, clientId: client.id }))}
      />
    </div>
  );
}


