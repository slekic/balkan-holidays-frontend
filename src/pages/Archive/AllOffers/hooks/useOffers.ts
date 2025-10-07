import { useState, useEffect } from "react";
import { Offer, OfferDetailed, OfferFilters } from "../types";
import {
  deleteOfferApi,
  duplicateOfferApi,
  getOffer,
  updateOfferStatusAPI,
  getAllOffers,
} from "../../../../api/offer";
import {
  mapOffer,
  mapOfferToForm,
  mapPonudaToOffer,
} from "../../../../utils/offer_response_mappers";
import { useNavigate } from "react-router-dom";
import {
  exportOfferInvoice,
  exportOfferProforma,
  exportSelectedOffers,
} from "../../../../api/export";
import { toast } from "react-toastify";

const itemsPerPage = 6;
const pagesPerBatch = 5;
const batchSize = itemsPerPage * pagesPerBatch;

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

  // ----------------- FETCH -----------------
  const fetchBatch = async (
    batchNumber: number,
    filters: OfferFilters,
    searchTerm: string
  ) => {
    const appliedFilters = {
      search: searchTerm,
      client: filters.client,
      entity: filters.entity,
      status: filters.status,
      createdBy: filters.createdBy,
      personsMin: Number(filters.personsMin),
      personsMax: Number(filters.personsMax),
      priceMin: Number(filters.priceMin),
      priceMax: Number(filters.priceMax),
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    };

    try {
      const page = batchNumber;
      const data = await getAllOffers(page, batchSize, false, -1, appliedFilters);
      const mapped = data.items.map(mapPonudaToOffer);
      setCurrentBatch(mapped);
      setFilteredOffers(mapped);
      setTotalItems(data.total);
    } catch (error) {
      console.error("Failed to fetch offers:", error);
    }
  };

  // Inicijalno učitavanje
  useEffect(() => {
    fetchBatch(1, filters, searchTerm);
    setCurrentBatchNumber(1);
  }, []);

  // ----------------- PAGINACIJA -----------------
  const localPage =
    currentPage % pagesPerBatch === 0
      ? pagesPerBatch
      : currentPage % pagesPerBatch;

  const startIndex = (localPage - 1) * itemsPerPage;
  const currentOffers = filteredOffers.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = async (page: number) => {
    const newBatch = page % pagesPerBatch;

    if (newBatch === 1 || newBatch === 0) {
      const newBatchNumber = Math.ceil(page / pagesPerBatch);
      await fetchBatch(newBatchNumber, filters, searchTerm);
      setCurrentBatchNumber(newBatchNumber);
    }
    setCurrentPage(page);
  };

  // ----------------- AKCIJE -----------------
  const handleStatusChange = async (offerId: string, newStatus: string) => {
    const result = await updateOfferStatusAPI({ offerId, newStatus });
    if (result.success) {
      setCurrentBatch((prev) =>
        prev.map((offer) =>
          offer.id === offerId ? { ...offer, status: newStatus as Offer["status"] } : offer
        )
      );

      setFilteredOffers((prevFiltered) =>
        prevFiltered.map((offer) =>
          offer.id === offerId ? { ...offer, status: newStatus as Offer["status"] } : offer
        )
      );
    } else console.error("Failed to update status:", result.message);
  };

  const handleAction = async (action: string, offerId: string) => {
    if (action === "delete") {
      try {
        await deleteOfferApi(offerId);
        toast.success("Ponuda prebačena u smeće");
        const newBatch = currentBatch.filter((o) => o.id !== offerId);
        updateBatchAndTotals(newBatch, totalItems - 1);

        if (newBatch.length === 0 && currentPage > 1) {
          handlePageChange(currentPage - 1);
        }
        
      } catch {
        toast.error("Neuspešno brisanje ponude");
      }
    } else if (action === "duplicate") {
      try {
        const newOffer = await duplicateOfferApi(offerId);
        const mapped = mapPonudaToOffer(newOffer);
        toast.success("Kopija ponude uspešno kreirana");
        const newBatch = [mapped, ...currentBatch];
        updateBatchAndTotals(newBatch, totalItems + 1);
      } catch {
        toast.error("Neuspešno pravljenje kopije");
      }
    } else if (action === "view" || action === "edit") {
      try {
        const offerDetailedApi = await getOffer(offerId);
        const offerDetailed = mapOffer(offerDetailedApi);
        if (action === "view") setViewPonuda(offerDetailed || null);
        else {
          const offerFormData = mapOfferToForm(offerDetailed);
          navigate(`/offer-creation/${offerDetailedApi.id}/edit`, {
            state: { offer: { ...offerFormData, id: offerDetailedApi.id } },
          });
        }
      } catch {
        toast.error("Greška prilikom otvaranja ponude");
      }
    } else if (action === "proforma") {
      try {
        await exportOfferProforma(Number(offerId));
      } catch {
        toast.error("Neuspešno eksportovanje predračuna");
      }
    } else if (action === "advance") {
      try {
        await exportOfferInvoice(Number(offerId), true);
      } catch {
        toast.error("Neuspešno eksportovanje avansne fakture");
      }
    } else if (action === "final") {
      try {
        await exportOfferInvoice(Number(offerId), false);
      } catch {
        toast.error("Neuspešno eksportovanje fakture");
      }
    }
  };

  // ----------------- SEARCH & FILTERI -----------------
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const updateBatchAndTotals = (newBatch: Offer[] | Offer[], total?: number) => {
    setCurrentBatch(newBatch);
    setFilteredOffers(newBatch);
    if (total !== undefined) setTotalItems(total);
  };


  const handleFilterChange = (newFilters: OfferFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = async () => {
    const emptyFilters: OfferFilters = {
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
    };
    setFilters(emptyFilters);
    setSearchTerm("");
    setShowFilters(false);
    await fetchBatch(1, emptyFilters, "");
    setCurrentBatchNumber(1);
    setCurrentPage(1);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleCloseView = () => {
    setViewPonuda(null);
  };

  const handleApplyFilters = async (filters: OfferFilters, searchTerm: string) => {
    await fetchBatch(1, filters, searchTerm);
    setCurrentBatchNumber(1);
    setCurrentPage(1);
  };

  const handleExport = async () => {
    if (!filteredOffers || filteredOffers.length === 0) {
      toast.warning("Nema ponuda za export");
      return;
    }
    const offersIds = filteredOffers.map((offer) => Number(offer.id));
    try {
      await exportSelectedOffers(offersIds);
    } catch {
      toast.error("Greška prilikom exporta ponuda");
    }
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
    pagesPerBatch,
    currentBatchNumber,
    handleStatusChange,
    handleAction,
    handleExport,
    handlePageChange,
    handleSearchChange,
    handleFilterChange,
    handleToggleFilters,
    handleApplyFilters,
    handleResetFilters,
  };
};
