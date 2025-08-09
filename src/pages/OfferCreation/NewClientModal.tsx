import React, { useState } from "react";
import { X } from "lucide-react";
import { NewClientFormData } from "../../types/offer";
import { useCMS } from "../../contexts/CMSContext";
import { Client } from "../../types/cms";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (client: Client) => void;
};

export default function NewClientModal({ open, onClose, onCreated }: Props) {
  const { addClient } = useCMS();
  const [form, setForm] = useState<NewClientFormData>({ name: "", pib: "" });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.pib.trim()) return;
    const created = addClient({ name: form.name, pib: form.pib } as Omit<
      Client,
      "id" | "createdAt" | "updatedAt"
    >) as unknown as Client;
    // Context's addClient returns Client per provider setup
    onCreated(created);
    setForm({ name: "", pib: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Dodaj novog klijenta
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Naziv klijenta <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="npr. ABC Travel Agency"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PIB (poreski broj) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.pib}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, pib: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder="npr. 123456789"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Otkaži
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Dodaj klijenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
