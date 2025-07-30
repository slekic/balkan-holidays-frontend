import React, { useState } from "react";
import { useCMS } from "../../contexts/CMSContext";
import { Transport, VATGroup } from "../../types/cms";
import EntityList from "../../components/CMS/Common/EntityList";
import EntityModal from "../../components/CMS/Common/EntityModal";

export default function TransportPage() {
  const { transports, addTransport, updateTransport, deleteTransport } =
    useCMS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState<Transport | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<Transport>>({
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
    setEditingTransport(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (transport: Transport) => {
    setFormData(transport);
    setEditingTransport(transport);
    setIsModalOpen(true);
  };

  const handleDelete = (transport: Transport) => {
    if (confirm(`Are you sure you want to delete "${transport.name}"?`)) {
      deleteTransport(transport.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      alert("Transport name is required");
      return;
    }

    if (editingTransport) {
      updateTransport(editingTransport.id, formData);
    } else {
      addTransport(
        formData as Omit<Transport, "id" | "createdAt" | "updatedAt">
      );
    }

    setIsModalOpen(false);
    resetForm();
  };

  const columns = [
    {
      key: "name",
      label: "Naziv transporta",
    },
    {
      key: "defaultComment",
      label: "Podrazumevani komentar",
      render: (transport: Transport) => (
        <span className="text-sm text-gray-600 max-w-xs truncate">
          {transport.defaultComment || "-"}
        </span>
      ),
    },
    {
      key: "vatGroup",
      label: "PDV grupa",
      render: (transport: Transport) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {transport.vatGroup}
        </span>
      ),
    },
  ];

  return (
    <>
      <EntityList
        title="Prevoz"
        description="Upravljaj prevoz entitetima za kreiranje ponuda"
        entities={transports}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Pretraži transport..."
        getSearchValue={(transport) => transport.name}
      />

      <EntityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTransport ? "Izmeni prevoz" : "Dodaj novi prevoz"}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Naziv prevoza <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="npr. Aerodromski transfer, Gradski autobuski obilazak"
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
              {editingTransport ? "Ažuriraj prevoz" : "Dodaj prevoz"}
            </button>
          </div>
        </form>
      </EntityModal>
    </>
  );
}
