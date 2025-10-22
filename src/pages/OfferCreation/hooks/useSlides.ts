import { useEffect, useState, useCallback } from "react";
import { Slide, SlideType, slideTypeLabels } from "../utils/constants";
import { getSlides, reorderSlides, saveSlides } from "../../../api/offer";
import { mapSlajdResponseToSlide } from "../../../utils/offer_response_mappers";
import { uploadMultipleEntitiesImages } from "../../../api/cms";
import { toast } from "react-toastify";
import { downloadOfferPresentation } from "../../../api/export";
import { BACKEND_URL } from "../../../config";

export interface SlideFile {
  file: File;
  fileIndex: number;
  preview?: string; // za prikaz u UI
}

export function useSlides(offerId: string | null) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [showAddSlideModal, setShowAddSlideModal] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [newSlideType, setNewSlideType] = useState<SlideType>("general");
  const [draggedSlide, setDraggedSlide] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchSlides = useCallback(async () => {
    if (!offerId) return;
    try {
      const slidesData = await getSlides(offerId);
      const mappedSlides = slidesData.map(mapSlajdResponseToSlide);
      console.log("ucitaniiiiiii " + JSON.stringify(mappedSlides))
      setSlides(mappedSlides);
    } catch (err) {
      console.error("Failed to fetch slides:", err);
    }
  }, [offerId]);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  // Reorder slides i regeneri redni broj
  const handleSlideReorder = async (dragIndex: number, hoverIndex: number) => {
  const draggedSlide = slides[dragIndex];
  const reordered = [...slides];

  // Ukloni slajd sa stare pozicije i ubaci ga na novu
  reordered.splice(dragIndex, 1);
  reordered.splice(hoverIndex, 0, draggedSlide);

  // Generiši mapu stari_num → novi_num (backend koristi numeraciju od 1)
  const renumberMap: Record<number, number> = {};
    reordered.forEach((slide, index) => {
      const newNum = index + 1;
      renumberMap[slide.num] = newNum;
    });

    console.log("RENUBER MAP:", renumberMap);

    try {
      if (offerId) {
        await reorderSlides(offerId, renumberMap);
      } else {
        console.warn("offerId not defined, skipping reorderSlides call.");
        return;
      }

      // Ažuriraj num vrednosti lokalno
      const updatedSlides = reordered.map((slide, index) => ({
        ...slide,
        num: index + 1,
      }));

      setSlides(updatedSlides);
      console.log("Novi redosled slajdova:", updatedSlides.map(s => s.num));
    } catch (err) {
      toast.error("Neuspešno pomeranje slajdova");
      console.error("Greška prilikom reorderovanja:", err);
    }
  };

  const handleDeleteSlide = async (slideId: string) => {
    if (
      typeof window === "undefined" ||
      window.confirm("Da li ste sigurni da želite da obrišete slajd?")
    ) {
      try {
        await fetch(`${BACKEND_URL}/ponuda/slides/${Number(slideId)}`, { method: "DELETE" });
        setSlides((prev) => prev.filter((s) => s.id !== slideId));
      } catch (err) {
        toast.error("Neuspešno brisanje slajda");
        console.error("Greška prilikom brisanja slajda:", err);
      }
    }
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      type: newSlideType,
      title: `New ${slideTypeLabels[newSlideType]}`,
      content: {},
      num: slides.length + 1,
    };
    setSlides((prev) => [...prev, newSlide]);
    setShowAddSlideModal(false);
    setEditingSlide(newSlide);
  };

  const saveSlidesHandler = async () => {
    if (!offerId) return;

    try {
      const slajdoviPayload = slides.map((slide) => ({
        naslov: slide.title,
        tip: slide.type,
        sadrzaj: { ...slide.content },
        redni_broj: slide.num,
      }));

      console.log("SLIII  " + JSON.stringify(slajdoviPayload))

      // 2️⃣ Pošalji slajdove i dobij mapu redni_broj -> id
      const redniIdMap = await saveSlides(offerId, slajdoviPayload)

      console.log("Redni -> ID mapa:", redniIdMap);

      const entityIds: number[] = [];
      const entityTypes: string[] = [];
      const filesArr: string[] = [];
      const tipoviArr: string[] = [];
      const exsist: string[] = [];
      const exsistIds: number[] = [];

      slides.forEach((slide) => {
        const slideId = redniIdMap[slide.num];
        const content = slide.content || {};
        
         if (content.backgroundImage){
          if(content.backgroundImage.startsWith("data:")) {
            filesArr.push(content.backgroundImage);
            tipoviArr.push("logo");
            entityIds.push(slideId);
            entityTypes.push("slajd");
          } else {
            exsistIds.push(slideId);
            exsist.push(content.backgroundImage);
          }
        }

        content.images?.forEach((img: string) => {
          if (img && img.startsWith("data:")) {
            filesArr.push(img);
            tipoviArr.push("slika");
            entityIds.push(slideId);
            entityTypes.push("slajd");
          } else {
            exsistIds.push(slideId);
            exsist.push(img);
          }
        });
      });

      console.log("IIIIIIII")
      console.log(exsistIds)
      console.log(exsist)

      // 4️⃣ Pozovi batch upload funkciju
      
        const uploadRes = await uploadMultipleEntitiesImages(
          "slajd",
          entityIds,
          entityTypes,
          filesArr,
          tipoviArr,
          exsistIds,
          exsist
        );
        console.log("Upload slides images result:", uploadRes);

      toast.success("Slajdovi uspešno sačuvani!")
      console.log("Slides saved and files uploaded successfully!");
    } catch (err) {
      toast.error("Greška prilikom čuvanja slajdova!")
      console.error("Failed to save slides and upload files:", err);
    }
  };

  const exportPresentation = async (offerId: string | null) => {
    if (!offerId) {
      toast.error("Ponuda nije sačuvana!");
      return;
    }

    const slidesWithImagesTypes: SlideType[] = ["activity", "restaurant", "hotel", "day"];

    const invalidSlides = slides.filter(
      (s) =>
        slidesWithImagesTypes.includes(s.type) &&
        (!s.content.images || s.content.images.length < 3)
    );

    if (invalidSlides.length > 0) {
      console.log("Ivalidni ", JSON.stringify(invalidSlides))
      toast.error("Svi slideovi sa galerijom moraju imati najmanje 3 slike!");
      return;
    }

    try {
      setIsGenerating(true); 
      await downloadOfferPresentation(Number(offerId));
      toast.success("Prezentacija uspešno generisana!");
    } catch (err) {
      toast.error("Greška prilikom generisanja!");
      console.error(err);
    } finally {
      setIsGenerating(false); 
    }
  };

  return {
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
    saveSlidesHandler, 
    exportPresentation,
    isGenerating,
  };
}
