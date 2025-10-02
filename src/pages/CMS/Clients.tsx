import React, { useState } from "react";
import { useCMS } from "../../contexts/CMSContext";
import { Client } from "../../types/cms";
import EntityList from "../../components/CMS/Common/EntityList";
import EntityModal from "../../components/CMS/Common/EntityModal";
import { toast } from "react-toastify";

export default function Clients() {
  const { clients, addClient, updateClient, deleteClient } = useCMS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({
    name: "",
    pib: "",
    address: "",
    bill: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      pib: "",
      address: "",
      bill: "",
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
      toast.error("Naziv klijenta je obavezan");
      return;
    }

    if (!formData.address?.trim()) {
      alert("Adresa klijenta je obavezna");
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
    { key: "name", label: "Naziv klijenta" },
    {
      key: "pib",
      label: "PIB (poreski broj)",
      render: (client: Client) => (
        <span className="font-mono text-sm">{client.pib}</span>
      ),
    },
    { key: "address", label: "Adresa" },
    {
      key: "tekuciRacun",
      label: "Tekući račun",
      render: (client: Client) => (
        <span className="font-mono text-sm">{client.bill}</span>
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
        getSearchValue={(client) =>
          `${client.name} ${client.pib} ${client.address} ${client.bill}`
        }
      />

      <EntityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? "Izmeni klijenta" : "Dodaj novog klijenta"}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Naziv */}
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

          {/* Adresa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address || ""}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Bulevar kralja Aleksandra 123, Beograd"
              required
            />
          </div>

          {/* PIB */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PIB (poreski broj) 
            </label>
            <input
              type="text"
              value={formData.pib || ""}
              onChange={(e) =>
                setFormData({ ...formData, pib: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder="e.g., 123456789"
            />
          </div>

          {/* Tekući račun */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tekući račun
            </label>
            <input
              type="text"
              value={formData.bill || ""}
              onChange={(e) =>
                setFormData({ ...formData, bill: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder="e.g., 160-123456-78"
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
