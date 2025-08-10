import React from "react";
import Header from "./Header";
import SummaryCards from "./SummaryCards";
import SearchFilterBar from "./SearchFilterBar";
import UsersTable from "./UsersTable";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import { useUserState } from "./hooks/useUserState";

export default function UserManagement() {
  const {
    users,
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

  const [showFilters, setShowFilters] = React.useState(false);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<any>(null);

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
        filters={filters as any}
        setFilters={setFilters as any}
      />
      <UsersTable
        users={filteredUsers}
        onEdit={(u) => {
          setEditingUser(u);
          setShowEditModal(true);
        }}
        onToggleStatus={toggleStatus}
        onDelete={(id) => deleteUser(id)}
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
        onSave={(u) => {
          updateUser(u);
          setShowEditModal(false);
        }}
      />
    </div>
  );
}
