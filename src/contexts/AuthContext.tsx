import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "../types";
import { loginRequest } from "../api/auth";
import { toast } from "react-toastify";

interface AuthContextType {
  user: User | null;
  setUser?: (user: User | null) => void; // <-- dodato
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Učitavanje session-a pri mount-u
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        let parsedUser: User;

        if (savedUser.startsWith("{")) {
          parsedUser = JSON.parse(savedUser);
        } else {
          // fallback ako je ostao samo string (npr. "admin1")
          parsedUser = {
            id: "",
            name: savedUser,
            email: "",
            role: "Operation",
            isActive: true,
          };
        }

        setUser(parsedUser);
      } catch (err) {
        console.error("Invalid user in storage", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await loginRequest(email, password);
      const u = data.data;
      const newUser: User = {
        id: u.id,
        name: u.username ?? u.sub,
        email: u.email,
        role: u.role,
        isActive: u.isActive ?? true,
      };

      setUser(newUser);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(newUser));

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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  if (loading) {
    return <div>Checking session...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // <-- dodato
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
