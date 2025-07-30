import React, { useState } from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { Activity, VATGroup } from '../../types/cms';
import EntityList from '../../components/CMS/Common/EntityList';
import EntityModal from '../../components/CMS/Common/EntityModal';
import ImageUpload from '../../components/CMS/Common/ImageUpload';

export default function Activities() {
  const { activities, addActivity, updateActivity, deleteActivity } = useCMS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState<Partial<Activity>>({
    name: '',
    defaultComment: '',
    description: '',
    backgroundImage: '',
    images: [],
    vatGroup: '20%'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      defaultComment: '',
      description: '',
      backgroundImage: '',
      images: [],
      vatGroup: '20%'
    });
    setEditingActivity(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (activity: Activity) => {
    setFormData(activity);
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleDelete = (activity: Activity) => {
    if (confirm(`Are you sure you want to delete "${activity.name}"?`)) {
      deleteActivity(activity.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      alert('Activity name is required');
      return;
    }

    if (editingActivity) {
      updateActivity(editingActivity.id, formData);
    } else {
      addActivity(formData as Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>);
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  const columns = [
    {
      key: 'name',
      label: 'Naziv aktivnosti'
    },
    {
      key: 'defaultComment',
      label: 'Podrazumevani komentar',
      render: (activity: Activity) => (
        <span className="text-sm text-gray-600 max-w-xs truncate">
          {activity.defaultComment || '-'}
        </span>
      )
    },
    {
      key: 'images',
      label: 'Slike',
      render: (activity: Activity) => (
        <span className="text-sm">
          {activity.backgroundImage ? 1 : 0} + {activity.images.length} images
        </span>
      )
    },
    {
      key: 'vatGroup',
      label: 'PDV grupa',
      render: (activity: Activity) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {activity.vatGroup}
        </span>
      )
    }
  ];

  return (
    <>
      <EntityList
        title="Aktivnosti"
        description="Upravljaj entitetima aktivnosti za kreiranje ponuda"
        entities={activities}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Pretraži aktivnosti..."
        getSearchValue={(activity) => activity.name}
      />

      <EntityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingActivity ? 'Izmeni aktivnost' : 'Dodaj novu aktivnost'}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Naziv aktivnosti <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Saint Sava Temple – tickets"
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
              placeholder="Komentar koji se koristi u Excel kalkulacijama"
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
              placeholder="Opis aktivnosti za PDF prezentacije"
            />
          </div>

          <ImageUpload
            label="Pozadinska slika"
            value={formData.backgroundImage}
            onChange={(value) => setFormData({ ...formData, backgroundImage: value })}
          />

          <ImageUpload
            label="Dodatne slike"
            multiple
            values={formData.images || []}
            onMultipleChange={(images) => setFormData({ ...formData, images })}
            maxImages={3}
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
              <option value="Article 35">Član 35 – Oslobođeno PDV-a u EU</option>
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
              {editingActivity ? 'Ažuriraj aktivnost' : 'Dodaj aktivnost'}
            </button>
          </div>
        </form>
      </EntityModal>
    </>
  );
}