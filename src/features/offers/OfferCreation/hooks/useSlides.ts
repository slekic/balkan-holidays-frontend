import { useMemo, useState } from "react";
import { Slide, SlideType, slideTypeLabels } from "../utils/constants";

export function useSlides() {
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: "1",
      type: "general",
      title: "Welcome to Belgrade",
      content: {
        description:
          "Discover the vibrant capital of Serbia with our expertly crafted tour experience.",
        logo: "https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop",
      },
    },
    {
      id: "2",
      type: "what-to-expect",
      title: "What to Expect from Us",
      content: {},
    },
  ]);

  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [showAddSlideModal, setShowAddSlideModal] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [newSlideType, setNewSlideType] = useState<SlideType>("general");
  const [draggedSlide, setDraggedSlide] = useState<string | null>(null);

  const handleSlideReorder = (dragIndex: number, hoverIndex: number) => {
    const dragged = slides[dragIndex];
    const next = [...slides];
    next.splice(dragIndex, 1);
    next.splice(hoverIndex, 0, dragged);
    setSlides(next);
  };

  const handleDeleteSlide = (slideId: string) => {
    if (typeof window === "undefined" || window.confirm("Are you sure you want to delete this slide?")) {
      setSlides((prev) => prev.filter((s) => s.id !== slideId));
    }
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      type: newSlideType,
      title: `New ${slideTypeLabels[newSlideType]}`,
      content: {},
    };
    setSlides((prev) => [...prev, newSlide]);
    setShowAddSlideModal(false);
    setEditingSlide(newSlide);
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
  };
}


