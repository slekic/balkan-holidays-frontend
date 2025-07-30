import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

interface EntityListProps<T> {
  title: string;
  description: string;
  entities: T[];
  columns: {
    key: keyof T | string;
    label: string;
    render?: (entity: T) => React.ReactNode;
  }[];
  onAdd: () => void;
  onEdit: (entity: T) => void;
  onDelete: (entity: T) => void;
  searchPlaceholder?: string;
  getSearchValue?: (entity: T) => string;
}

export default function EntityList<T extends { id: string }>({
  title,
  description,
  entities,
  columns,
  onAdd,
  onEdit,
  onDelete,
  searchPlaceholder = "Pretraga...",
  getSearchValue
}: EntityListProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntities = entities.filter(entity => {
    if (!searchTerm) return true;
    const searchValue = getSearchValue ? getSearchValue(entity) : String(entity.id);
    return searchValue.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getValue = (entity: T, key: keyof T | string) => {
    if (typeof key === 'string' && key.includes('.')) {
      const keys = key.split('.');
      let value: any = entity;
      for (const k of keys) {
        value = value?.[k];
      }
      return value;
    }
    return entity[key as keyof T];
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Dodaj novo
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredEntities.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nema rezultata' : `Još uvek nema ${title.toLowerCase()} yet`}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? `Nijedan ${title.toLowerCase()} ne odgovara kriterijumu pretrage.`
              : `Započni tako što ćeš kreirati prvi ${title.toLowerCase().slice(0, -1)}.`
            }
          </p>
          {!searchTerm && (
            <button
              onClick={onAdd}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Dodaj novi {title.slice(0, -1)}
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {columns.map((column, index) => (
                  <th key={index} className="text-left py-3 px-4 font-medium text-gray-900">
                    {column.label}
                  </th>
                ))}
                <th className="text-right py-3 px-4 font-medium text-gray-900">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntities.map((entity) => (
                <tr key={entity.id} className="border-b border-gray-100 hover:bg-gray-50">
                  {columns.map((column, index) => (
                    <td key={index} className="py-3 px-4 text-gray-700">
                      {column.render ? column.render(entity) : String(getValue(entity, column.key) || '-')}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(entity)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(entity)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}