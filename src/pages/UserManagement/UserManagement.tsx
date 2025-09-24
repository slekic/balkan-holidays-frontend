import React, { useState } from "react";
import Header from "./Header";
import SummaryCards from "./SummaryCards";
import SearchFilterBar from "./SearchFilterBar";
import UsersTable from "./UsersTable";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import { useUserState } from "./hooks/useUserState";
import { User } from "../../types/user"; // TAČAN IMPORT

export default function UserManagement() {
  const {
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
  } = useUserState();

  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null); // TIP-SIGURNO

  return (
    <div className="space-y-6">
      <Header onAdd={() => setShowAddModal(true)} />
      <SummaryCards
        total={stats.total}
        activeUsers={stats.activeUsers}
        adminUsers={stats.adminUsers}
      />
      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        setFilters={setFilters}
      />
      <UsersTable
        users={filteredUsers}
        onEdit={(user) => {
          setEditingUser(user);
          setShowEditModal(true);
        }}
        onToggleStatus={toggleStatus}
        onDelete={deleteUser}
      />
      <AddUserModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addUser}
      />
      <EditUserModal
        open={showEditModal}
        user={editingUser}
        onClose={() => setShowEditModal(false)}
        onSave={(user) => {
          updateUser(user);
          setShowEditModal(false);
        }}
      />
    </div>
  );
}
