import React, { createContext, useContext } from "react";
import { useUserState } from "./hooks/useUserState";

type UserContextType = ReturnType<typeof useUserState>;

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userState = useUserState();
  return <UserContext.Provider value={userState}>{children}</UserContext.Provider>;
};

// Hook za korišćenje konteksta
export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUsers must be used within a UserProvider");
  return context;
};
