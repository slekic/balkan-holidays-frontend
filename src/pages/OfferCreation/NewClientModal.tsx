import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { NewClientFormData } from "../../types/offer";
import { useCMS } from "../../contexts/CMSContext";
import { Client } from "../../types/cms";
import { BACKEND_URL } from "../../config";
import { mapKlijentResponseToClient } from "../../utils/cms_response_mappers";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (client: Client) => void;
};

export default function NewClientModal({ open, onClose, onCreated }: Props) {
  const { addExClients } = useCMS();
  const [banks, setBanks] = useState<{ id: number; banka: string }[]>([]);
  const [form, setForm] = useState<NewClientFormData>({
    name: "",
    address: "",
    pib: "",
    bill: "",
    bank: "",
  });

  useEffect(() => {
    if (!open) return;
    const fetchBanks = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/cms/banke`);
        const data = await res.json();
        setBanks(data);
      } catch (error) {
        console.error("Greška pri učitavanju banaka:", error);
      }
    };
    fetchBanks();
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/cms/klijent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naziv: form.name,
          adresa: form.address,
          pib: form.pib,
          tekuci_racun: form.bill,
          banka: Number(form.bank),
        }),
      });

      if (!res.ok) throw new Error("Greška prilikom kreiranja klijenta");
      const resp = await res.json();
      const created: Client = mapKlijentResponseToClient(resp);

      addExClients(created);

      onCreated(created);

      setForm({ name: "", address: "", pib: "", bill: "", bank: "" });
      onClose();
    } catch (error) {
      console.error("Greška prilikom dodavanja klijenta:", error);
      alert("Došlo je do greške prilikom dodavanja klijenta.");
    }
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
          {/* Naziv */}
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

          {/* Adresa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, address: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder="e.g., Bulevar kralja Aleksandra 123, Beograd"
              required
            />
          </div>

          {/* Banka */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banka <span className="text-red-500">*</span>
            </label>
            <select
              value={form.bank}
              onChange={(e) => setForm((p) => ({ ...p, bank: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" disabled>
                -- Izaberite banku --
              </option>
              {banks.map((banka) => (
                <option key={banka.id} value={banka.id}>
                  {banka.banka}
                </option>
              ))}
            </select>
          </div>

          {/* PIB */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PIB (poreski broj)
            </label>
            <input
              type="text"
              value={form.pib}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, pib: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder="npr. 123456789"
            />
          </div>

          {/* Tekući račun */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tekući račun
            </label>
            <input
              type="text"
              value={form.bill}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, bill: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder="npr. 160-123456-78"
            />
          </div>

          {/* Dugmad */}
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
