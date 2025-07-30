import React, { useState } from "react";
import { useCMS } from "../../contexts/CMSContext";
import { Hotel, RoomType, VATGroup } from "../../types/cms";
import EntityList from "../../components/CMS/Common/EntityList";
import EntityModal from "../../components/CMS/Common/EntityModal";
import ImageUpload from "../../components/CMS/Common/ImageUpload";
import { Plus, X } from "lucide-react";

export default function Hotels() {
  const { hotels, addHotel, updateHotel, deleteHotel } = useCMS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState<Partial<Hotel>>({
    name: "",
    roomTypes: [],
    websiteLink: "",
    logo: "",
    description: "",
    numberOfRooms: 0,
    numberOfRestaurants: 0,
    vatGroup: "20%",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      roomTypes: [],
      websiteLink: "",
      logo: "",
      description: "",
      numberOfRooms: 0,
      numberOfRestaurants: 0,
      vatGroup: "20%",
    });
    setEditingHotel(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (hotel: Hotel) => {
    setFormData(hotel);
    setEditingHotel(hotel);
    setIsModalOpen(true);
  };

  const handleDelete = (hotel: Hotel) => {
    if (confirm(`Are you sure you want to delete "${hotel.name}"?`)) {
      deleteHotel(hotel.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      alert("Hotel name is required");
      return;
    }

    if (editingHotel) {
      updateHotel(editingHotel.id, formData);
    } else {
      addHotel(formData as Omit<Hotel, "id" | "createdAt" | "updatedAt">);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const addRoomType = () => {
    const roomTypes = formData.roomTypes || [];
    setFormData({
      ...formData,
      roomTypes: [...roomTypes, { id: Date.now().toString(), name: "" }],
    });
  };

  const updateRoomType = (index: number, name: string) => {
    const roomTypes = [...(formData.roomTypes || [])];
    roomTypes[index] = { ...roomTypes[index], name };
    setFormData({ ...formData, roomTypes });
  };

  const removeRoomType = (index: number) => {
    const roomTypes = formData.roomTypes?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, roomTypes });
  };

  const columns = [
    {
      key: "name",
      label: "Naziv hotela",
    },
    {
      key: "roomTypes",
      label: "Tipovi soba",
      render: (hotel: Hotel) => (
        <span className="text-sm">
          {hotel.roomTypes.length > 0
            ? hotel.roomTypes.map((rt) => rt.name).join(", ")
            : "Nema definisanih tipova soba"}
        </span>
      ),
    },
    {
      key: "numberOfRooms",
      label: "Broj soba",
    },
    {
      key: "numberOfRestaurants",
      label: "Broj restorana",
    },
    {
      key: "vatGroup",
      label: "PDV grupa",
      render: (hotel: Hotel) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {hotel.vatGroup}
        </span>
      ),
    },
  ];

  return (
    <>
      <EntityList
        title="Hoteli"
        description="Upravljaj hotelima za kreiranje ponuda"
        entities={hotels}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Pretraži hotele..."
        getSearchValue={(hotel) => hotel.name}
      />

      <EntityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHotel ? "Izmeni hotel" : "Dodaj novi hotel"}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Naziv hotela <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipovi soba
            </label>
            <div className="space-y-2">
              {formData.roomTypes?.map((roomType, index) => (
                <div key={roomType.id} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={roomType.name}
                    onChange={(e) => updateRoomType(index, e.target.value)}
                    placeholder="Naziv tipa sobe"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeRoomType(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addRoomType}
                className="flex items-center px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Dodaj tip sobe
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link ka sajtu
            </label>
            <input
              type="url"
              value={formData.websiteLink || ""}
              onChange={(e) =>
                setFormData({ ...formData, websiteLink: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>

          <ImageUpload
            label="Logo hotela"
            value={formData.logo}
            onChange={(value) => setFormData({ ...formData, logo: value })}
          />

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
              placeholder="Opis hotela za PDF prezentacije"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Broj soba
              </label>
              <input
                type="number"
                min="0"
                value={formData.numberOfRooms || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numberOfRooms: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Broj restorana
              </label>
              <input
                type="number"
                min="0"
                value={formData.numberOfRestaurants || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numberOfRestaurants: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
              {editingHotel ? "Ažuriraj hotel" : "Dodaj hotel"}
            </button>
          </div>
        </form>
      </EntityModal>
    </>
  );
}
