import React, { useState } from "react";
import { useCMS } from "../../contexts/CMSContext";
import { Translator, VATGroup } from "../../types/cms";
import EntityList from "../../components/CMS/Common/EntityList";
import EntityModal from "../../components/CMS/Common/EntityModal";

export default function Translators() {
  const { translators, addTranslator, updateTranslator, deleteTranslator } =
    useCMS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTranslator, setEditingTranslator] = useState<Translator | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<Translator>>({
    name: "",
    defaultComment: "",
    vatGroup: "20%",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      defaultComment: "",
      vatGroup: "20%",
    });
    setEditingTranslator(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (translator: Translator) => {
    setFormData(translator);
    setEditingTranslator(translator);
    setIsModalOpen(true);
  };

  const handleDelete = (translator: Translator) => {
    if (confirm(`Are you sure you want to delete "${translator.name}"?`)) {
      deleteTranslator(translator.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      alert("Translator name is required");
      return;
    }

    if (editingTranslator) {
      updateTranslator(editingTranslator.id, formData);
    } else {
      addTranslator(
        formData as Omit<Translator, "id" | "createdAt" | "updatedAt">
      );
    }

    setIsModalOpen(false);
    resetForm();
  };

  const columns = [
    {
      key: "name",
      label: "Ime prevodioca",
    },
    {
      key: "defaultComment",
      label: "Podrazumevani komentar",
      render: (translator: Translator) => (
        <span className="text-sm text-gray-600 max-w-xs truncate">
          {translator.defaultComment || "-"}
        </span>
      ),
    },
    {
      key: "vatGroup",
      label: "PDV grupa",
      render: (translator: Translator) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {translator.vatGroup}
        </span>
      ),
    },
  ];

  return (
    <>
      <EntityList
        title="Prevodioci"
        description="Upravljaj prevodiocima za kreiranje ponuda"
        entities={translators}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Pretraži prevodioce..."
        getSearchValue={(translator) => translator.name}
      />

      <EntityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingTranslator ? "Izmeni prevodioca" : "Dodaj novog prevodioca"
        }
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ime prevodioca <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., English Translator, German Interpreter"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Podrazumevani komentar
            </label>
            <textarea
              value={formData.defaultComment || ""}
              onChange={(e) =>
                setFormData({ ...formData, defaultComment: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Komentar koji se koristi u Excel kalkulacijama"
            />
          </div>

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
              {editingTranslator ? "Ažuriraj prevodioca" : "Dodaj prevodioca"}
            </button>
          </div>
        </form>
      </EntityModal>
    </>
  );
}
