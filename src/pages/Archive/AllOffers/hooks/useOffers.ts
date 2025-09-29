import { useState, useEffect } from "react";
import { Offer, OfferDetailed, OfferFilters } from "../types";
import {
  deleteOfferApi,
  duplicateOfferApi,
  getOffer,
  updateOfferStatusAPI,
  getAllOffers,
} from "../../../../api/offer";
import { mapOffer, mapOfferToForm, mapPonudaToOffer } from "../../../../utils/offer_response_mappers";
import { useNavigate } from "react-router-dom";
import { exportOfferInvoice, exportOfferProforma, exportSelectedOffers } from "../../../../api/export";
import { toast } from "react-toastify";

const itemsPerPage = 6;        // koliko prikazujemo po strani
const pagesPerBatch = 5;       // batch od 5 stranica
const batchSize = itemsPerPage * pagesPerBatch; // ukupno itema po batch-u

export const useOffers = () => {
  const [currentBatch, setCurrentBatch] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBatchNumber, setCurrentBatchNumber] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewPonuda, setViewPonuda] = useState<OfferDetailed | null>(null);
  const [filters, setFilters] = useState<OfferFilters>({
    client: "",
    entity: "",
    createdBy: "",
    status: "",
    personsMin: "",
    personsMax: "",
    priceMin: "",
    priceMax: "",
    dateFrom: "",
    dateTo: "",
  });

  const navigate = useNavigate();

  // ----- Fetch batch -----
  const fetchBatch = async (batchNumber: number) => {
    try {
      const page = (batchNumber - 1) * pagesPerBatch + 1;
      const data = await getAllOffers(page, batchSize);
      const mapped = data.items.map(mapPonudaToOffer);
      setCurrentBatch(mapped);
      setTotalItems(data.total);
    } catch (error) {
      console.error("Failed to fetch batch:", error);
    }
  };

  useEffect(() => {
    fetchBatch(1);
    setCurrentBatchNumber(1);
  }, []);

  // ----- Filter + search na trenutni batch -----
  useEffect(() => {
    let filtered = [...currentBatch];

    if (searchTerm.trim() !== "") {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (offer) =>
          offer.name.toLowerCase().includes(lowerTerm) ||
          offer.code.toLowerCase().includes(lowerTerm)
      );
    }

    if (filters.client) {
      filtered = filtered.filter((offer) => offer.client === filters.client);
    }
    if (filters.status) {
      filtered = filtered.filter((offer) => offer.status === filters.status);
    }
    if (filters.createdBy) {
      filtered = filtered.filter((offer) => offer.createdBy === filters.createdBy);
    }
    if (filters.entity) {
      filtered = filtered.filter((offer) =>
        offer.entities.some((entity) =>
          entity.toLowerCase().includes(filters.entity.toLowerCase())
        )
      );
    }
    if (filters.personsMin) {
      filtered = filtered.filter(
        (offer) => offer.numberOfPersons >= Number(filters.personsMin)
      );
    }
    if (filters.personsMax) {
      filtered = filtered.filter(
        (offer) => offer.numberOfPersons <= Number(filters.personsMax)
      );
    }
    if (filters.priceMin) {
      filtered = filtered.filter(
        (offer) => offer.totalPrice >= Number(filters.priceMin)
      );
    }
    if (filters.priceMax) {
      filtered = filtered.filter(
        (offer) => offer.totalPrice <= Number(filters.priceMax)
      );
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(
        (offer) => new Date(offer.startDate) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(
        (offer) => new Date(offer.endDate) <= new Date(filters.dateTo)
      );
    }

    setFilteredOffers(filtered);
    setTotalItems(filtered.length);

  }, [currentBatch, searchTerm, filters]);

  // ----- Local pagination -----
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOffers = filteredOffers.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    console.log("STRRRR" + page)
    const newBatchNumber = Math.ceil(page / pagesPerBatch);

    if (newBatchNumber !== currentBatchNumber) {
      fetchBatch(newBatchNumber);
      setCurrentBatchNumber(newBatchNumber);
    }

    setCurrentPage(page);
  };

  // ----- Ostale akcije -----
  const handleStatusChange = async (offerId: string, newStatus: string) => {
    const result = await updateOfferStatusAPI({ offerId, newStatus });
    if (result.success) {
      setCurrentBatch((prev) =>
        prev.map((offer) =>
          offer.id === offerId ? { ...offer, status: newStatus as Offer["status"] } : offer
        )
      );
    } else console.error("Failed to update status:", result.message);
  };

  const handleAction = async (action: string, offerId: string) => {
    if (action === "delete") {
      try {
        await deleteOfferApi(offerId);
        toast.success("Ponuda prebačena u smeće")
        setCurrentBatch((prev) => prev.filter((offer) => offer.id !== offerId));
      } catch (error) {
        console.error(`Failed to delete offer ${offerId}:`, error);
        toast.error("Neuspešno")
      }
    } else if (action === "duplicate") {
      try {
        const newOffer = await duplicateOfferApi(offerId);
        console.log()
        const mapped = mapPonudaToOffer(newOffer);
        toast.success("Kopija ponude uspešno kreirana")
        setCurrentBatch((prev) => [mapped, ...prev]);
      } catch (error) {
        console.error(`Failed to duplicate offer ${offerId}:`, error);
        toast.error("Neuspešno pravljenje kopije")
      }
    } else if (action === "view" || action === "edit") {
      try {
        const offerDetailedApi = await getOffer(offerId);
        const offerDetailed = mapOffer(offerDetailedApi);
        if (action === "view") setViewPonuda(offerDetailed || null);
        if (action === "edit") {
          const offerFormData = mapOfferToForm(offerDetailed);
          navigate(`/offer-creation/${offerDetailedApi.id}/edit`, { 
            state: { offer: { ...offerFormData, id: offerDetailedApi.id } } 
          });
        }
      } catch (error) {
        console.error(`Failed to fetch offer ${offerId}:`, error);
      }
    }else if(action == "proforma"){
      try {
        await exportOfferProforma(Number(offerId));
      } catch (error) {
        toast.error("Neuspešno eksportovanje predračuna");
      }
    } else if(action == "advance"){
      try {
          await exportOfferInvoice(Number(offerId), true);
      } catch (error) {
          toast.error("Neuspešno eksportovanje avansne fakture");
      }

    } else if(action == "final"){
      try {
          await exportOfferInvoice(Number(offerId), false);
      } catch (error) {
          toast.error("Neuspešno eksportovanje fakture");
      }
    }
  };

  const handleExport = async () => {
    if (!filteredOffers || filteredOffers.length === 0) {
      console.warn("Nema ponuda za export");
      return;
    }

    const offersIds = filteredOffers.map((offer) => Number(offer.id));

    try {
      await exportSelectedOffers(offersIds);
    } catch (err) {
      console.error("Greška prilikom exporta ponuda:", err);
    }
  };

 const handleSearchChange = (value: string) => {
  setSearchTerm(value);
  if (value !== searchTerm) {
    setCurrentPage(1);
  }
};

  const handleFilterChange = (newFilters: OfferFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleCloseView = () => {
    setViewPonuda(null);
  };

  return {
    viewPonuda,
    setViewPonuda,
    handleCloseView,
    currentOffers,
    currentPage,
    showFilters,
    searchTerm,
    filters,
    totalPages,
    totalItems,
    itemsPerPage,
    startIndex,
    handleStatusChange,
    handleAction,
    handleExport,
    handlePageChange,
    handleSearchChange,
    handleFilterChange,
    handleToggleFilters,
  };
};
