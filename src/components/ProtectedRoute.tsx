import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: User['role'][];
}

export default function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pristup odbijen</h2>
          <p className="text-gray-600">Nemate dozvolu za pristup ovoj stranici.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}