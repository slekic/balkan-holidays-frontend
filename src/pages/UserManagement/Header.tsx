import React from 'react';
import { Plus, Users } from 'lucide-react';

export function Header({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upravljanje korisnicima</h1>
        <p className="text-gray-600 mt-1">Upravljajte korisnicima, ulogama i dozvolama</p>
      </div>
      <button onClick={onAdd} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        <Plus className="w-4 h-4 mr-2" />
        Dodaj korisnika
      </button>
    </div>
  );
}

export default Header;


