import React, { useState } from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { Restaurant, VATGroup } from '../../types/cms';
import EntityList from '../../components/CMS/Common/EntityList';
import EntityModal from '../../components/CMS/Common/EntityModal';
import ImageUpload from '../../components/CMS/Common/ImageUpload';

export default function Restaurants() {
  const { restaurants, addRestaurant, updateRestaurant, deleteRestaurant } = useCMS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [formData, setFormData] = useState<Partial<Restaurant>>({
    name: '',
    defaultComment: '',
    websiteLink: '',
    description: '',
    images: [],
    vatGroup: '20%'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      defaultComment: '',
      websiteLink: '',
      description: '',
      images: [],
      vatGroup: '20%'
    });
    setEditingRestaurant(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (restaurant: Restaurant) => {
    setFormData(restaurant);
    setEditingRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const handleDelete = (restaurant: Restaurant) => {
    if (confirm(`Are you sure you want to delete "${restaurant.name}"?`)) {
      deleteRestaurant(restaurant.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      alert('Restaurant name is required');
      return;
    }

    if (editingRestaurant) {
      updateRestaurant(editingRestaurant.id, formData);
    } else {
      addRestaurant(formData as Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>);
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  const columns = [
    {
      key: 'name',
      label: 'Naziv restorana'
    },
    {
      key: 'defaultComment',
      label: 'Podrazumevani komentar',
      render: (restaurant: Restaurant) => (
        <span className="text-sm text-gray-600 max-w-xs truncate">
          {restaurant.defaultComment || '-'}
        </span>
      )
    },
    {
      key: 'images',
      label: 'Slike',
      render: (restaurant: Restaurant) => (
        <span className="text-sm">
          {restaurant.images.length} slik{restaurant.images.length !== 1 ? 'e' : 'a'}
        </span>
      )
    },
    {
      key: 'vatGroup',
      label: 'PDV grupa',
      render: (restaurant: Restaurant) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {restaurant.vatGroup}
        </span>
      )
    }
  ];

  return (
    <>
      <EntityList
        title="Restorani"
        description="Upravljaj restoranima za kreiranje ponuda"
        entities={restaurants}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Pretraži restorane..."
        getSearchValue={(restaurant) => restaurant.name}
      />

      <EntityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRestaurant ? 'Izmeni restoran' : 'Dodaj novi restoran'}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Naziv restorana <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Podrazumevani komentar
            </label>
            <input
              type="text"
              value={formData.defaultComment || ''}
              onChange={(e) => setFormData({ ...formData, defaultComment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Comment used in Excel calculations"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link ka sajtu
            </label>
            <input
              type="url"
              value={formData.websiteLink || ''}
              onChange={(e) => setFormData({ ...formData, websiteLink: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opis
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Opis restorana za PDF prezentacije"
            />
          </div>

          <ImageUpload
            label="Slike restorana"
            multiple
            values={formData.images || []}
            onMultipleChange={(images) => setFormData({ ...formData, images })}
            maxImages={8}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PDV grupa <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.vatGroup || '20%'}
              onChange={(e) => setFormData({ ...formData, vatGroup: e.target.value as VATGroup })}
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
              {editingRestaurant ? 'Ažuriraj restoran' : 'Dodaj restoran'}
            </button>
          </div>
        </form>
      </EntityModal>
    </>
  );
}