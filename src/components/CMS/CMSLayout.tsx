import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Building2, 
  UtensilsCrossed, 
  Car, 
  Languages, 
  UserCheck, 
  MapPin, 
  Gift, 
  Users, 
  Calendar 
} from 'lucide-react';

const cmsNavItems = [
  { id: 'hotels', label: 'Hoteli', icon: Building2, path: '/cms/hotels' },
  { id: 'restaurants', label: 'Restorani', icon: UtensilsCrossed, path: '/cms/restaurants' },
  { id: 'transport', label: 'Prevoz', icon: Car, path: '/cms/transport' },
  { id: 'translators', label: 'Prevodilac', icon: Languages, path: '/cms/translators' },
  { id: 'guides', label: 'Vodiči', icon: UserCheck, path: '/cms/guides' },
  { id: 'activities', label: 'Aktivnosti', icon: MapPin, path: '/cms/activities' },
  { id: 'gifts', label: 'Pokloni', icon: Gift, path: '/cms/gifts' },
  { id: 'clients', label: 'Klijenti', icon: Users, path: '/cms/clients' },
  { id: 'day-templates', label: 'Šabloni Dana', icon: Calendar, path: '/cms/day-templates' }
];

export default function CMSLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">CMS Entiteti</h2>
          <p className="text-sm text-gray-600 mt-1">Upravljajte predefinisanim entitetima koji se koriste u kreiranju ponuda</p>
        </div>
        
        <div className="p-4">
          <nav className="grid grid-cols-3 gap-3">
            {cmsNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg border-2 transition-colors ${
                    active
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Outlet />
      </div>
    </div>
  );
}