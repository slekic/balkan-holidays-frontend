import { User, UserRole, UserStatus } from './types';

export const getRoleColor = (role: UserRole) => {
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

export const getStatusColor = (status: UserStatus) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'Inactive':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getRolePermissions = (role: UserRole) => {
  switch (role) {
    case 'Admin':
      return 'Puni pristup sistemu, Upravljanje korisnicima, Svi moduli';
    case 'Operation':
      return 'Kreiranje ponuda, CMS entiteti, Arhiva ponuda';
    case 'Finance':
      return 'Finansijski modul (Arhiva, Troškovi, Uplate, Dugovanja)';
    default:
      return 'Dozvole nisu definisane';
  }
};

export const generateId = () => `${Date.now()}`;


