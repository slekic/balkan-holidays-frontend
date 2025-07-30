import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  Database,
  Archive,
  DollarSign,
  Users,
  ChevronDown,
  ChevronRight,
  Menu
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NavigationItem } from '../../types';

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Kontrolna tabla',
    icon: 'Home',
    path: '/dashboard',
    roles: ['Admin', 'Operation', 'Finance']
  },
  {
    id: 'offer-creation',
    label: 'Kreiranje ponude',
    icon: 'FileText',
    path: '/offer-creation',
    roles: ['Admin', 'Operation']
  },
  {
    id: 'cms',
    label: 'CMS Entiteti',
    icon: 'Database',
    roles: ['Admin', 'Operation'],
    children: [
      { id: 'hotels', label: 'Hoteli', path: '/cms/hotels', roles: ['Admin', 'Operation'] },
      { id: 'restaurants', label: 'Restorani', path: '/cms/restaurants', roles: ['Admin', 'Operation'] },
      { id: 'transport', label: 'Prevoz', path: '/cms/transport', roles: ['Admin', 'Operation'] },
      { id: 'guides', label: 'Vodiči', path: '/cms/guides', roles: ['Admin', 'Operation'] },
      { id: 'activities', label: 'Aktivnosti', path: '/cms/activities', roles: ['Admin', 'Operation'] },
      { id: 'gifts', label: 'Pokloni', path: '/cms/gifts', roles: ['Admin', 'Operation'] },
      { id: 'day-templates', label: 'Šabloni dana', path: '/cms/day-templates', roles: ['Admin', 'Operation'] }
    ]
  },
  {
    id: 'archive',
    label: 'Arhiva ponuda',
    icon: 'Archive',
    roles: ['Admin', 'Operation'],
    children: [
      { id: 'all-offers', label: 'Sve ponude', path: '/archive/all', roles: ['Admin', 'Operation'] },
      { id: 'follow-up', label: 'Ponude za praćenje', path: '/archive/follow-up', roles: ['Admin', 'Operation'] },
      { id: 'trash', label: 'Kanta', path: '/archive/trash', roles: ['Admin', 'Operation'] }
    ]
  },
  {
    id: 'finance',
    label: 'Finansijski modul',
    icon: 'DollarSign',
    roles: ['Admin', 'Finance'],
    children: [
      { id: 'finance-archive', label: 'Arhiva', path: '/finance/archive', roles: ['Admin', 'Finance'] },
      { id: 'expenses', label: 'Rashodi', path: '/finance/expenses', roles: ['Admin', 'Finance'] },
      { id: 'payments', label: 'Uplate', path: '/finance/payments', roles: ['Admin', 'Finance'] },
      { id: 'debts', label: 'Dugovanja', path: '/finance/debts', roles: ['Admin', 'Finance'] }
    ]
  },
  {
    id: 'users',
    label: 'Upravljanje korisnicima',
    icon: 'Users',
    path: '/users',
    roles: ['Admin']
  }
];

const iconMap = {
  Home,
  FileText,
  Database,
  Archive,
  DollarSign,
  Users
};

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['cms', 'archive', 'finance']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const hasAccess = (roles: string[]) => {
    return user && roles.includes(user.role);
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    if (!hasAccess(item.roles)) return null;

    const Icon = iconMap[item.icon as keyof typeof iconMap];
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const childrenActive = hasChildren && item.children?.some(child => isActive(child.path));
    const active = isActive(item.path);

    const firstChildPath = item.children?.[0]?.path;
        
    if (hasChildren) {
      return (
        <div key={item.id}>
          <div className="flex">
            <Link
              to={firstChildPath || '#'}
              className={`flex-1 flex items-center px-3 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                active || childrenActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${level > 0 ? 'ml-4' : ''}`}
            >
              {Icon && <Icon className="w-5 h-5 mr-3 flex-shrink-0" />}
              <span className="flex-1 text-left">{item.label}</span>
            </Link>
            <button
              onClick={() => toggleExpanded(item.id)}
              className={`px-2 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                active || childrenActive
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${level > 0 ? 'mr-4' : ''}`}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
          {isExpanded && (
            <div className="mt-1 space-y-1">
              {item.children?.map(child => renderNavigationItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.path!}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors mb-1 ${
          active
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100'
        } ${level > 0 ? 'ml-4' : ''}`}
      >
        {Icon && <Icon className="w-5 h-5 mr-3 flex-shrink-0" />}
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map(item => renderNavigationItem(item))}
      </nav>
    </div>
  );
}