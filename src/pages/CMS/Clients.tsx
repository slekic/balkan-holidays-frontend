import React, { useState } from "react";
import { useCMS } from "../../contexts/CMSContext";
import { Client } from "../../types/cms";
import EntityList from "../../components/CMS/Common/EntityList";
import EntityModal from "../../components/CMS/Common/EntityModal";

export default function Clients() {
  const { clients, addClient, updateClient, deleteClient } = useCMS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({
    name: "",
    pib: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      pib: "",
    });
    setEditingClient(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    setFormData(client);
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = (client: Client) => {
    if (confirm(`Are you sure you want to delete "${client.name}"?`)) {
      deleteClient(client.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      alert("Client name is required");
      return;
    }

    if (!formData.pib?.trim()) {
      alert("PIB (Tax ID) is required");
      return;
    }

    if (editingClient) {
      updateClient(editingClient.id, formData);
    } else {
      addClient(formData as Omit<Client, "id" | "createdAt" | "updatedAt">);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const columns = [
    {
      key: "name",
      label: "Naziv klijenta",
    },
    {
      key: "pib",
      label: "PIB (poreski broj)",
      render: (client: Client) => (
        <span className="font-mono text-sm">{client.pib}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Kreirano",
      render: (client: Client) => (
        <span className="text-sm text-gray-600">
          {new Date(client.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <>
      <EntityList
        title="Klijenti"
        description="Upravljaj klijentima za kreiranje ponuda"
        entities={clients}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Pretraži klijente..."
        getSearchValue={(client) => `${client.name} ${client.pib}`}
      />

      <EntityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? "Izmeni klijenta" : "Dodaj novog klijenta"}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Naziv klijenta <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., ABC Travel Agency"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PIB (poreski broj) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.pib || ""}
              onChange={(e) =>
                setFormData({ ...formData, pib: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder="e.g., 123456789"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingClient ? "Izmeni klijenta" : "Dodaj novog klijenta"}
            </button>
          </div>
        </form>
      </EntityModal>
    </>
  );
}
