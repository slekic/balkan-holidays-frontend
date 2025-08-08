import React from "react";
import { X, Plus, GripVertical, Edit, Trash2 } from "lucide-react";
import { Slide, slideTypeIcons, slideTypeLabels } from "../utils/constants";

type Props = {
  open: boolean;
  onClose: () => void;
  slides: Slide[];
  setSlides: (slides: Slide[]) => void;
  draggedSlide: string | null;
  setDraggedSlide: (id: string | null) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (slide: Slide) => void;
  onDelete: (id: string) => void;
  onOpenAdd: () => void;
};

export default function SlidesModal({ open, onClose, slides, setSlides, draggedSlide, setDraggedSlide, onReorder, onEdit, onDelete, onOpenAdd }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Generiši PDF prezentaciju</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Slajdovi prezentacije</h3>
              <p className="text-sm text-gray-600 mt-1">Prevuci za promenu redosleda, klikni za izmenu ili dodaj nove slajdove</p>
            </div>
            <button onClick={onOpenAdd} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Dodaj slajd
            </button>
          </div>

          <div className="space-y-4">
            {slides.map((slide, index) => {
              const SlideIcon = slideTypeIcons[slide.type];
              return (
                <div
                  key={slide.id}
                  className={`bg-white border-2 rounded-lg p-4 transition-all ${draggedSlide === slide.id ? "border-blue-500 shadow-lg" : "border-gray-200 hover:border-gray-300"}`}
                  draggable
                  onDragStart={() => setDraggedSlide(slide.id)}
                  onDragEnd={() => setDraggedSlide(null)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedSlide) {
                      const dragIndex = slides.findIndex((s) => s.id === draggedSlide);
                      onReorder(dragIndex, index);
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex items-center space-x-2">
                        <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                        <div className="flex items-center space-x-2">
                          <SlideIcon className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-500">{slideTypeLabels[slide.type]}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">{slide.title}</h4>
                        {slide.type === "general" && (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">{slide.content.description}</p>
                            {slide.content.logo && (
                              <img src={slide.content.logo} alt="Logo" className="w-16 h-12 object-cover rounded" />
                            )}
                          </div>
                        )}
                        {slide.type === "what-to-expect" && (
                          <p className="text-sm text-gray-600">Fiksni šablon sa informacijama o kompaniji i opisom usluga koje nudimo</p>
                        )}
                        {slide.type === "day" && (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">Dan {slide.content.dayNumber}: {slide.content.description}</p>
                            <div className="flex space-x-2">
                              {slide.content.images?.slice(0, 3).map((img: string, i: number) => (
                                <img key={i} src={img} alt={`Day ${i + 1}`} className="w-12 h-8 object-cover rounded" />
                              ))}
                            </div>
                          </div>
                        )}
                        {slide.type === "hotel" && (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">{slide.content.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{slide.content.numberOfRooms} soba</span>
                              <span>{slide.content.numberOfRestaurants} restorana</span>
                            </div>
                            <div className="flex space-x-2">
                              {slide.content.images?.slice(0, 3).map((img: string, i: number) => (
                                <img key={i} src={img} alt={`Hotel ${i + 1}`} className="w-12 h-8 object-cover rounded" />
                              ))}
                            </div>
                          </div>
                        )}
                        {slide.type === "restaurant" && (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">{slide.content.description}</p>
                            <div className="flex space-x-2">
                              {slide.content.images?.slice(0, 4).map((img: string, i: number) => (
                                <img key={i} src={img} alt={`Restaurant ${i + 1}`} className="w-12 h-8 object-cover rounded" />
                              ))}
                            </div>
                          </div>
                        )}
                        {slide.type === "gift" && (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">{slide.content.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>€{slide.content.price}</span>
                              <span>{slide.content.whatsIncluded}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => onEdit(slide)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit slide">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(slide.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete slide">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Otkaži</button>
          <button onClick={() => { console.log("Exporting PDF with slides:", slides); alert("PDF export would start here!"); }} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Export PDF</button>
        </div>
      </div>
    </div>
  );
}


