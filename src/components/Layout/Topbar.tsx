import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { changePassword } from '../../api/users';

interface TopbarProps {
  title: string;
  breadcrumbs?: { label: string; path?: string }[];
}

export default function Topbar({ title, breadcrumbs }: TopbarProps) {
  const { user, logout } = useAuth();

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // za prikaz/sakrivanje lozinki
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Finance':
        return 'bg-green-100 text-green-800';
      case 'Operation':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Sva polja su obavezna');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Niste lepo ponovili novu lozinku');
      return;
    }
    try {
      if (user?.id) {
        await changePassword(Number(user.id), {
          stara_lozinka: currentPassword,
          nova_lozinka: newPassword,
        });
        toast.success('Uspešna promena lozinke');
      }
    } catch (err: any) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }

    setShowChangePassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex mt-1" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2">/</span>}
                    <span
                      className={
                        index === breadcrumbs.length - 1
                          ? 'text-gray-900 font-medium'
                          : ''
                      }
                    >
                      {crumb.label}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setShowChangePassword(true)}
            >
              <User className="w-8 h-8 p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition" />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                      user?.role || ''
                    )}`}
                  >
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 relative">
            <button
              onClick={() => setShowChangePassword(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Promenite lozinku
            </h2>

            {error && (
              <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-3 text-center">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {/* Trenutna lozinka */}
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="Trenutna lozinka"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((p) => !p)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showCurrent ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              {/* Nova lozinka */}
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="Nova lozinka"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((p) => !p)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showNew ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              {/* Potvrda nove lozinke */}
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Ponovite novu lozinku"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showConfirm ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-5 space-x-3">
              <button
                onClick={() => setShowChangePassword(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Odustani
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Promeni
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
