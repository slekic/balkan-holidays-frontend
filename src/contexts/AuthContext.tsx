import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { loginRequest } from '../api/auth';
import { toast } from 'react-toastify';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Učitavanje session-a iz localStorage/JWT pri mount-u
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload: any = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.id,
          name: payload.sub,
          email: payload.email,
          role: payload.role,
          isActive: payload.isActive ?? true,
        });
        localStorage.setItem('user', payload.sub);
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const data = await loginRequest(email, password);
    const u = data.data;
    setUser({
      id: u.id,
      name: u.sub,
      email: u.email,
      role: u.role,
      isActive: u.isActive ?? true,
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", u.sub);
    return true;
  } catch (error: any) {
    console.error(error);

    const message =
      error.response?.data?.detail || "Greška prilikom prijave.";

    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
    });

    return false;
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem("user");
  };

  // dok se učitava, prikaz loader
  if (loading) {
    return <div>Checking session...</div>; 
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
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
