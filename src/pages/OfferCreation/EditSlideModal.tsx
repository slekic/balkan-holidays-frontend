import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Slide, slideTypeLabels } from "./utils/constants";
import ImageUpload from "../../components/CMS/Common/ImageUpload";

type Props = {
  slide: Slide | null;
  onClose: () => void;
  onSave: (updated: Slide) => void;
};

export default function EditSlideModal({ slide, onClose, onSave }: Props) {
  const [localSlide, setLocalSlide] = useState<Slide | null>(slide);

  useEffect(() => {
    setLocalSlide(slide);
  }, [slide]);

  if (!localSlide) return null;

  const handleChange = (updates: Partial<Slide>) => {
    setLocalSlide({ ...localSlide, ...updates });
  };

  const handleContentChange = (updates: Partial<typeof localSlide.content>) => {
    if (!localSlide) return;
    setLocalSlide({
      ...localSlide,
      content: { ...localSlide.content, ...updates },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Izmeni {slideTypeLabels[localSlide.type]}
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
            {/* Naslov */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Naslov
              </label>
              <input
                type="text"
                value={localSlide.title}
                onChange={(e) => handleChange({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* General slide */}
            {localSlide.type === "general" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opis
                  </label>
                  <textarea
                    value={localSlide.content.description || ""}
                    onChange={(e) =>
                      handleContentChange({ description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <ImageUpload
                    label="Logo"
                    value={localSlide.content.logo || ""}
                    onChange={(value) => handleContentChange({ logo: value })}
                  />
                </div>
              </>
            )}

            {/* Day slide */}
            {localSlide.type === "day" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Broj dana
                  </label>
                  <input
                    type="number"
                    value={localSlide.content.dayNumber || 1}
                    onChange={(e) =>
                      handleContentChange({
                        dayNumber: parseInt(e.target.value),
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
                    value={localSlide.content.description || ""}
                    onChange={(e) =>
                      handleContentChange({ description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <ImageUpload
                    label="Pozadinska slika"
                    value={localSlide.content.backgroundImage || ""}
                    onChange={(value) =>
                      handleContentChange({ backgroundImage: value })
                    }
                  />
                </div>
                <div>
                  <ImageUpload
                    label="Dodatne slike dana"
                    multiple
                    values={localSlide.content.images || []}
                    onMultipleChange={(images) => handleContentChange({ images })}
                    maxImages={3} onChange={function (value: string): void {
                      throw new Error("Function not implemented.");
                    } }                  />
                </div>
              </>
            )}

            {/* Hotel, restaurant, gift slides */}
            {["hotel", "restaurant", "gift"].includes(localSlide.type) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Naziv {localSlide.type === "hotel"
                    ? "hotela"
                    : localSlide.type === "restaurant"
                    ? "restorana"
                    : "poklona"}
                </label>
                <input
                  type="text"
                  value={localSlide.content.name || ""}
                  onChange={(e) =>
                    handleContentChange({ name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* What-to-expect slide */}
            {localSlide.type === "what-to-expect" && (
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
            onClick={() => localSlide && onSave(localSlide)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sačuvaj promene
          </button>
        </div>
      </div>
    </div>
  );
}
