import { useMemo, useState, useEffect } from "react";
import { User, UserRole, UserStatus } from "../../../types/user";
import { createUser, getAllUsers, deactivateUser, updateUser as updateUserApi, deleteUserApi } from "../../../api/users";
import { toast } from "react-toastify";

export function useUserState() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{ role: "" | UserRole; status: "" | UserStatus }>({ role: "", status: "" });

  // Fetch users on mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getAllUsers(false);
        const mappedUsers: User[] = data.map((u: any) => ({
          id: u.id.toString(),
          name: u.korisnicko_ime,
          email: u.email,
          role: u.uloga as UserRole,
          status: u.aktivan ? "Active" : "Inactive",
          createdAt: u.kreirano || new Date().toISOString().split("T")[0],
          lastLogin: u.poslednji_login || "",
        }));
        setUsers(mappedUsers);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    }

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = `${u.name} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase());
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

  const addUser = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const createdUser = await createUser({
        korisnicko_ime: name,
        email,
        lozinka: password,
        uloga: role,
      });

      const newUser: User = {
        id: createdUser.id.toString(),
        name: createdUser.korisnicko_ime,
        email: createdUser.email,
        role: createdUser.uloga as UserRole,
        status: createdUser.aktivan ? "Active" : "Inactive",
        createdAt: createdUser.kreirano || new Date().toISOString().split("T")[0],
        lastLogin: createdUser.poslednji_login || "",
      };

      toast.success("Uspešno kreiranje korisnika")
      setUsers((prev) => [...prev, newUser]);
    } catch (error: unknown) {
      console.error("Failed to create user:", error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Neuspelo kreiranje korisnika");
      }
    }

  };

  const updateUser = async (updatedData: User) => {
    try {
      const updatedUserFromBackend = await updateUserApi(Number(updatedData.id), {
        korisnicko_ime: updatedData.name!,
        email: updatedData.email!,
        lozinka: "", // optional, only if changing password
        uloga: updatedData.role!,
      });

      const updatedUser: User = {
        id: updatedUserFromBackend.id.toString(),
        name: updatedUserFromBackend.korisnicko_ime,
        email: updatedUserFromBackend.email,
        role: updatedUserFromBackend.uloga as UserRole,
        status: updatedUserFromBackend.aktivan ? "Active" : "Inactive",
        createdAt: updatedUserFromBackend.kreirano || new Date().toISOString().split("T")[0],
        lastLogin: updatedUserFromBackend.poslednji_login || "",
      };

      toast.success("Uspešno ažuriranje korisnika")
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    } catch (error: unknown) {
      console.error("Failed to create user:", error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Neuspelo ažuriranje korisnika");
      }
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await deleteUserApi(Number(id));

      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const updatedUserFromBackend = await deactivateUser(Number(id));

      const updatedUser: User = {
        id: updatedUserFromBackend.id.toString(),
        name: updatedUserFromBackend.korisnicko_ime,
        email: updatedUserFromBackend.email,
        role: updatedUserFromBackend.uloga as UserRole,
        status: updatedUserFromBackend.aktivan ? "Active" : "Inactive",
        createdAt: updatedUserFromBackend.kreirano || new Date().toISOString().split("T")[0],
        lastLogin: "",
      };

      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
    } catch (err) {
      console.error("Failed to toggle user status:", err);
    }
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
