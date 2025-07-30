import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  { id: '1', name: 'Stefan Lekić', email: 'admin@balkanhol.com', role: 'Admin', isActive: true },
  { id: '2', name: 'Luka Milenković', email: 'ops@balkanhol.com', role: 'Operation', isActive: true },
  { id: '3', name: 'Pavle Radić', email: 'finance@balkanhol.com', role: 'Finance', isActive: true },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - any credentials work
    const foundUser = mockUsers.find(u => u.email === email) || mockUsers[0];
    setUser(foundUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}