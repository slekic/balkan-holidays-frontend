import React from 'react';
import { Shield, UserCheck, UserX, Users } from 'lucide-react';

export default function SummaryCards({ total, activeUsers, adminUsers }: { total: number; activeUsers: number; adminUsers: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Ukupno korisnika</p>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
          </div>
          <div className="p-3 rounded-full bg-blue-100">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Aktivni korisnici</p>
            <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
          </div>
          <div className="p-3 rounded-full bg-green-100">
            <UserCheck className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Administratori</p>
            <p className="text-2xl font-bold text-purple-600">{adminUsers}</p>
          </div>
          <div className="p-3 rounded-full bg-purple-100">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Neaktivni korisnici</p>
            <p className="text-2xl font-bold text-red-600">{total - activeUsers}</p>
          </div>
          <div className="p-3 rounded-full bg-red-100">
            <UserX className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
}


