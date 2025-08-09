import React from "react";
import { X } from "lucide-react";
import { Slide, slideTypeLabels } from "./utils/constants";

type Props = {
  slide: Slide | null;
  onClose: () => void;
  onSave: (updated: Slide) => void;
};

export default function EditSlideModal({ slide, onClose, onSave }: Props) {
  if (!slide) return null;

  const setSlide = (updates: Partial<Slide>) => {
    const next = { ...slide, ...updates } as Slide;
    onSave(next);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Izmeni {slideTypeLabels[slide.type]}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Naslov
              </label>
              <input
                type="text"
                value={slide.title}
                onChange={(e) => setSlide({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {slide.type === "general" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opis
                  </label>
                  <textarea
                    value={slide.content.description || ""}
                    onChange={(e) =>
                      setSlide({
                        content: {
                          ...slide.content,
                          description: e.target.value,
                        },
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo link
                  </label>
                  <input
                    type="url"
                    value={slide.content.logo || ""}
                    onChange={(e) =>
                      setSlide({
                        content: { ...slide.content, logo: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/logo.jpg"
                  />
                </div>
              </>
            )}

            {slide.type === "day" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Broj dana
                  </label>
                  <input
                    type="number"
                    value={slide.content.dayNumber || 1}
                    onChange={(e) =>
                      setSlide({
                        content: {
                          ...slide.content,
                          dayNumber: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opis
                  </label>
                  <textarea
                    value={slide.content.description || ""}
                    onChange={(e) =>
                      setSlide({
                        content: {
                          ...slide.content,
                          description: e.target.value,
                        },
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pozadinska slika link
                  </label>
                  <input
                    type="url"
                    value={slide.content.backgroundImage || ""}
                    onChange={(e) =>
                      setSlide({
                        content: {
                          ...slide.content,
                          backgroundImage: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/background.jpg"
                  />
                </div>
              </>
            )}

            {slide.type === "hotel" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Naziv hotela
                </label>
                <input
                  type="text"
                  value={slide.content.name || ""}
                  onChange={(e) =>
                    setSlide({
                      content: { ...slide.content, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {slide.type === "restaurant" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Naziv restorana
                </label>
                <input
                  type="text"
                  value={slide.content.name || ""}
                  onChange={(e) =>
                    setSlide({
                      content: { ...slide.content, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {slide.type === "gift" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Naziv poklona
                </label>
                <input
                  type="text"
                  value={slide.content.name || ""}
                  onChange={(e) =>
                    setSlide({
                      content: { ...slide.content, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {slide.type === "what-to-expect" && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Ovo je fiksni šablon slajda sa unapred definisanim sadržajem o
                  uslugama i obećanjima vaše kompanije. Sadržaj se ne može
                  menjati kako bi se očuvala konzistentnost u svim
                  prezentacijama.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Otkaži
          </button>
          <button
            onClick={() => onSave(slide)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sačuvaj promene
          </button>
        </div>
      </div>
    </div>
  );
}
