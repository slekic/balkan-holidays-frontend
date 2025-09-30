import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { User, UserRole } from "../../types/user";
import { getRolePermissions } from "./utils";
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
};

export default function EditUserModal({ open, user, onClose, onSave }: Props) {
  const [editingUser, setEditingUser] = useState<User | null>(user);

  useEffect(() => {
    setEditingUser(user);
  }, [user]);

  if (!open || !editingUser) return null;

  const handleSave = () => {
    if (
      !editingUser.name.trim() ||
      !editingUser.email.trim() ||
      !editingUser.role.trim()
    ) {
      toast.error("Sva polja su obavezna.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.value = editingUser.email;

    if (!emailInput.checkValidity()) {
      toast.error("Unesite ispravnu email adresu.", { autoClose: 3000 });
      return;
    }


    onSave(editingUser);
    onClose();
  };

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
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Korisničko ime <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email adresa <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Uloga <span className="text-red-500">*</span>
            </label>
            <select
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  role: e.target.value as UserRole,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Operation">Operativa</option>
              <option value="Finance">Finansije</option>
              <option value="Admin">Administrator</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {getRolePermissions(editingUser.role)}
            </p>
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
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sačuvaj izmene
          </button>
        </div>
      </div>
    </div>
  );
}
