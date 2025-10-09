import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Slide, slideTypeLabels } from "./utils/constants";
import ImageUpload from "../../components/CMS/Common/ImageUpload";
import { useCMS } from "../../contexts/CMSContext";

type Props = {
  slide: Slide | null;
  onClose: () => void;
  onSave?: (updated: Slide) => void;
  dayTemplates?: {
    label: string;
    content: Partial<Slide["content"]>;
    title?: string;
  }[];
};

export default function EditSlideModal({ slide, onClose, onSave }: Props) {
  const [localSlide, setLocalSlide] = useState<Slide | null>(slide);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const dayTemplates = useCMS().dayTemplates;

  useEffect(() => {
    setLocalSlide(slide);
    setSelectedTemplate("");
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

  const handleSelectTemplate = (label: string) => {
    const template = dayTemplates.find((t) => t.title === label);
    if (!template || !localSlide) return;

    setSelectedTemplate(label);

    handleContentChange({ description: template.description || "" });
    if (template.title) {
      handleChange({ title: template.title });
    }
  };

  const isReadOnly = localSlide.type === "what-to-expect";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {isReadOnly ? "Generički slajd" : slideTypeLabels[localSlide.type]}
          </h3>
          {!isReadOnly && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
          {/* GENERAL SLIDE */}
          {localSlide.type === "general" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Naslov
                </label>
                <input
                  type="text"
                  value={localSlide.title || ""}
                  onChange={(e) => handleChange({ title: e.target.value })}
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
                  label="Logo"
                  value={localSlide.content.logo || ""}
                  onChange={(value) => handleContentChange({ logo: value })}
                />
              </div>
            </div>
          )}

          {/* WHAT TO EXPECT (read-only) */}
          {isReadOnly && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700">
                Naslov: {localSlide.title}
              </p>
              <p className="text-sm text-gray-600">
                {localSlide.content.description}
              </p>
            </div>
          )}

          {/* DAY SLIDE */}
          {["activity", "day"].includes(localSlide.type) && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Naslov
                </label>
                <input
                  type="text"
                  value={localSlide.title || ""}
                  onChange={(e) => handleChange({ title: e.target.value })}
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
                  label="Dodatne slike"
                  multiple
                  values={localSlide.content.images || []}
                  onMultipleChange={(images) =>
                    handleContentChange({ images })
                  }
                  maxImages={3}
                  onChange={() => {}}
                />
              </div>
            </div>
          )}

          {/* ACTIVITY / HOTEL / RESTAURANT */}
          {["hotel", "restaurant"].includes(localSlide.type) && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Naslov
                </label>
                <input
                  type="text"
                  value={localSlide.title || ""}
                  onChange={(e) => handleChange({ title: e.target.value })}
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
                  label="Slike"
                  multiple
                  values={localSlide.content.images || []}
                  onMultipleChange={(images) =>
                    handleContentChange({ images })
                  }
                  maxImages={8}
                  onChange={() => {}}
                />
              </div>
            </div>
          )}

          {/* GIFT */}
          {localSlide.type === "gift" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Naslov
                </label>
                <input
                  type="text"
                  value={localSlide.title || ""}
                  onChange={(e) => handleChange({ title: e.target.value })}
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
                  label="Slika poklona"
                  value={localSlide.content.images?.[0] || ""}
                  onChange={(value) =>
                    handleContentChange({ images: [value] })
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          {isReadOnly ? (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              OK
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Otkaži
              </button>
              <button
                onClick={() => localSlide && onSave?.(localSlide)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Sačuvaj promene
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
