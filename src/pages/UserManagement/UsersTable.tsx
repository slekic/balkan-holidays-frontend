import React from "react";
import { Edit, Trash2, UserCheck, UserX } from "lucide-react";
import { User } from "./types";
import { getRoleColor, getRolePermissions, getStatusColor } from "./utils";

type Props = {
  users: User[];
  onEdit: (u: User) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function UsersTable({
  users,
  onEdit,
  onToggleStatus,
  onDelete,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Korisnik
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Uloga
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Poslednja prijava
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Kreiran
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-900">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {getRolePermissions(user.role)}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-700">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "Never"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-700">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit User"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onToggleStatus(user.id)}
                      className={`p-1 transition-colors ${
                        user.status === "Active"
                          ? "text-gray-400 hover:text-red-600"
                          : "text-gray-400 hover:text-green-600"
                      }`}
                      title={
                        user.status === "Active"
                          ? "Deactivate User"
                          : "Activate User"
                      }
                    >
                      {user.status === "Active" ? (
                        <UserX className="w-4 h-4" />
                      ) : (
                        <UserCheck className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
