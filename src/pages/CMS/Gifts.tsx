import React, { useState } from "react";
import { useCMS } from "../../contexts/CMSContext";
import { Gift, VATGroup } from "../../types/cms";
import EntityList from "../../components/CMS/Common/EntityList";
import EntityModal from "../../components/CMS/Common/EntityModal";
import ImageUpload from "../../components/CMS/Common/ImageUpload";

export default function Gifts() {
  const { gifts, addGift, updateGift, deleteGift } = useCMS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [formData, setFormData] = useState<Partial<Gift>>({
    name: "",
    defaultComment: "",
    description: "",
    price: 0,
    whatsIncluded: "",
    image: "",
    vatGroup: "20%",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      defaultComment: "",
      description: "",
      price: 0,
      whatsIncluded: "",
      image: "",
      vatGroup: "20%",
    });
    setEditingGift(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (gift: Gift) => {
    setFormData(gift);
    setEditingGift(gift);
    setIsModalOpen(true);
  };

  const handleDelete = (gift: Gift) => {
    if (confirm(`Are you sure you want to delete "${gift.name}"?`)) {
      deleteGift(gift.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      alert("Gift name is required");
      return;
    }

    if (editingGift) {
      updateGift(editingGift.id, formData);
    } else {
      addGift(formData as Omit<Gift, "id" | "createdAt" | "updatedAt">);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const columns = [
    {
      key: "name",
      label: "Naziv poklona",
    },
    {
      key: "price",
      label: "Cena",
      render: (gift: Gift) => (
        <span className="font-medium">€{gift.price.toFixed(2)}</span>
      ),
    },
    {
      key: "defaultComment",
      label: "Podrazumevani komentar",
      render: (gift: Gift) => (
        <span className="text-sm text-gray-600 max-w-xs truncate">
          {gift.defaultComment || "-"}
        </span>
      ),
    },
    {
      key: "vatGroup",
      label: "PDV grupa",
      render: (gift: Gift) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {gift.vatGroup}
        </span>
      ),
    },
  ];

  return (
    <>
      <EntityList
        title="Pokloni"
        description="Upravljaj poklonima za kreiranje ponuda"
        entities={gifts}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Pretraži poklone..."
        getSearchValue={(gift) => gift.name}
      />

      <EntityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGift ? "Izmeni poklon" : "Dodaj novi poklon"}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Naziv poklona <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="npr. Poklon paket dobrodošlice"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Podrazumevani komentar
            </label>
            <input
              type="text"
              value={formData.defaultComment || ""}
              onChange={(e) =>
                setFormData({ ...formData, defaultComment: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Komentar za Excel kalkulacije"
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
              placeholder="Opcioni opis za PDF prezentacije"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cena <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                €
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Šta uključuje <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.whatsIncluded || ""}
              onChange={(e) =>
                setFormData({ ...formData, whatsIncluded: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Navedite šta se nalazi u poklon paketu"
              required
            />
          </div>

          <ImageUpload
            label="Naziv poklona"
            value={formData.image}
            onChange={(value) => setFormData({ ...formData, image: value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PDV grupa <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.vatGroup || "20%"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  vatGroup: e.target.value as VATGroup,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="10%">10%</option>
              <option value="20%">20%</option>
              <option value="Article 35">Član 35 oslobođeno (EU)</option>
            </select>
          </div>

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
              {editingGift ? "Ažuriraj poklon" : "Dodaj poklon"}
            </button>
          </div>
        </form>
      </EntityModal>
    </>
  );
}
