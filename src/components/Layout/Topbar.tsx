import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

interface TopbarProps {
  title: string;
  breadcrumbs?: { label: string; path?: string }[];
}

export default function Topbar({ title, breadcrumbs }: TopbarProps) {
  const { user, logout } = useAuth();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Finance':
        return 'bg-green-100 text-green-800';
      case 'Operation':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex mt-1" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2">/</span>}
                    <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''}>
                      {crumb.label}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <User className="w-8 h-8 p-1.5 bg-gray-100 rounded-full" />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    getRoleBadgeColor(user?.role || '')
                  }`}>
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}