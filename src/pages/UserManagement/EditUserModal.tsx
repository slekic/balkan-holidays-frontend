import React from "react";
import { X } from "lucide-react";
import { User, UserRole, UserStatus } from "./types";
import { getRolePermissions } from "./utils";

type Props = {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
};

export default function EditUserModal({ open, user, onClose, onSave }: Props) {
  const [editing, setEditing] = React.useState<User | null>(user);
  React.useEffect(() => setEditing(user), [user]);
  if (!open || !editing) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Izmeni korisnika
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Puno ime <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email adresa <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={editing.email}
              onChange={(e) =>
                setEditing({ ...editing, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Uloga <span className="text-red-500">*</span>
            </label>
            <select
              value={editing.role}
              onChange={(e) =>
                setEditing({ ...editing, role: e.target.value as UserRole })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Operation">Operativa</option>
              <option value="Finance">Finansije</option>
              <option value="Admin">Administrator</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {getRolePermissions(editing.role)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={editing.status}
              onChange={(e) =>
                setEditing({ ...editing, status: e.target.value as UserStatus })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Active">Aktivan</option>
              <option value="Inactive">Neaktivan</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Otkaži
          </button>
          <button
            onClick={() => editing && onSave(editing)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sačuvaj izmene
          </button>
        </div>
      </div>
    </div>
  );
}
