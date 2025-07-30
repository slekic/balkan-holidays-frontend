import React, { useState } from "react";
import { useCMS } from "../../contexts/CMSContext";
import { DayTemplate } from "../../types/cms";
import EntityList from "../../components/CMS/Common/EntityList";
import EntityModal from "../../components/CMS/Common/EntityModal";
import ImageUpload from "../../components/CMS/Common/ImageUpload";

export default function DayTemplates() {
  const { dayTemplates, addDayTemplate, updateDayTemplate, deleteDayTemplate } =
    useCMS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DayTemplate | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<DayTemplate>>({
    title: "",
    description: "",
    backgroundImage: "",
    galleryImages: [],
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      backgroundImage: "",
      galleryImages: [],
    });
    setEditingTemplate(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (template: DayTemplate) => {
    setFormData(template);
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleDelete = (template: DayTemplate) => {
    if (confirm(`Are you sure you want to delete "${template.title}"?`)) {
      deleteDayTemplate(template.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      alert("Template title is required");
      return;
    }

    if (editingTemplate) {
      updateDayTemplate(editingTemplate.id, formData);
    } else {
      addDayTemplate(
        formData as Omit<DayTemplate, "id" | "createdAt" | "updatedAt">
      );
    }

    setIsModalOpen(false);
    resetForm();
  };

  const columns = [
    {
      key: "title",
      label: "Naslov šablona",
    },
    {
      key: "description",
      label: "Opis",
      render: (template: DayTemplate) => (
        <span className="text-sm text-gray-600 max-w-xs truncate">
          {template.description || "-"}
        </span>
      ),
    },
    {
      key: "galleryImages",
      label: "Galerija slika",
      render: (template: DayTemplate) => (
        <span className="text-sm">
          {template.backgroundImage ? 1 : 0} + {template.galleryImages.length}{" "}
          images
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Kreirao",
      render: (template: DayTemplate) => (
        <span className="text-sm text-gray-600">
          {new Date(template.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <>
      <EntityList
        title="Šabloni dana"
        description="Upravljaj šablonima dana za slajdove u PDF prezentaciji"
        entities={dayTemplates}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Pretraži šablone dana..."
        getSearchValue={(template) => template.title}
      />

      <EntityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTemplate ? "Izmeni šablon" : "Dodaj šablon"}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Naslov šablona <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Day 1 - Belgrade City Tour"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opis
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Description for the day template slide"
            />
          </div>

          <ImageUpload
            label="Pozadinska slika"
            value={formData.backgroundImage}
            onChange={(value) =>
              setFormData({ ...formData, backgroundImage: value })
            }
          />

          <ImageUpload
            label="Slike"
            multiple
            values={formData.galleryImages || []}
            onMultipleChange={(images) =>
              setFormData({ ...formData, galleryImages: images })
            }
            maxImages={3}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Otkaži
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingTemplate ? "Ažuriraj šablon" : "Dodaj šablon"}
            </button>
          </div>
        </form>
      </EntityModal>
    </>
  );
}
