import { useMemo, useState } from "react";
import { User, UserRole, UserStatus } from "../types";
import { generateId } from "../utils";

const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@balkanhol.com",
    role: "Admin",
    status: "Active",
    createdAt: "2024-01-01",
    lastLogin: "2024-02-28",
  },
  {
    id: "2",
    name: "Operations Manager",
    email: "ops@balkanhol.com",
    role: "Operation",
    status: "Active",
    createdAt: "2024-01-05",
    lastLogin: "2024-02-27",
  },
  {
    id: "3",
    name: "Finance Manager",
    email: "finance@balkanhol.com",
    role: "Finance",
    status: "Active",
    createdAt: "2024-01-10",
    lastLogin: "2024-02-26",
  },
  {
    id: "4",
    name: "John Operations",
    email: "john.ops@balkanhol.com",
    role: "Operation",
    status: "Active",
    createdAt: "2024-01-15",
    lastLogin: "2024-02-25",
  },
  {
    id: "5",
    name: "Sarah Finance",
    email: "sarah.finance@balkanhol.com",
    role: "Finance",
    status: "Inactive",
    createdAt: "2024-01-20",
    lastLogin: "2024-02-20",
  },
];

export function useUserState() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{
    role: "" | UserRole;
    status: "" | UserStatus;
  }>({ role: "", status: "" });

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = `${u.name} ${u.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesRole = !filters.role || u.role === filters.role;
      const matchesStatus = !filters.status || u.status === filters.status;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, filters]);

  const stats = useMemo(() => {
    const activeUsers = users.filter((u) => u.status === "Active").length;
    const adminUsers = users.filter((u) => u.role === "Admin").length;
    return {
      total: users.length,
      activeUsers,
      adminUsers,
      inactiveUsers: users.length - activeUsers,
    };
  }, [users]);

  const addUser = (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    const user: User = {
      id: generateId(),
      name,
      email,
      role,
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [...prev, user]);
  };

  const updateUser = (user: User) => {
    setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
          : u
      )
    );
  };

  return {
    users,
    setUsers,
    filteredUsers,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    stats,
    addUser,
    updateUser,
    deleteUser,
    toggleStatus,
  };
}
