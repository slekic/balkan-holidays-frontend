import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FileText,
  Archive,
  DollarSign,
  Users,
  Calendar,
  Plus,
  CreditCard,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Ukupno ponuda",
      value: "247",
      icon: FileText,
      color: "blue",
    },
    {
      title: "Potrebno praćenje",
      value: "18",
      icon: Archive,
      color: "yellow",
    },
    {
      title: "Prihvaćene ponude",
      value: "89",
      icon: FileText,
      color: "green",
    },
    {
      title: "Neizmirena dugovanja",
      value: "€12,450",
      icon: DollarSign,
      color: "red",
    },
  ];

  const quickActions = [
    {
      title: "Kreiraj novu ponudu",
      description: "Započni izradu nove turističke ponude",
      icon: Plus,
      color: "blue",
      path: "/offer-creation",
      roles: ["Admin", "Operation"],
    },
    {
      title: "Pregled svih ponuda",
      description: "Pretraži kompletnu arhivu ponuda",
      icon: Archive,
      color: "green",
      path: "/archive/all",
      roles: ["Admin", "Operation"],
    },
    {
      title: "Evidentiraj uplatu",
      description: "Unesi novu uplatu klijenta",
      icon: CreditCard,
      color: "purple",
      path: "/finance/payments",
      roles: ["Admin", "Finance"],
    },
    {
      title: "Upravljanje korisnicima",
      description: "Dodavanje ili izmena korisničkih naloga",
      icon: Users,
      color: "orange",
      path: "/users",
      roles: ["Admin"],
    },
  ];

  const getStatColor = (color: string) => {
    const colors = {
      blue: "bg-blue-500",
      yellow: "bg-yellow-500",
      green: "bg-green-500",
      red: "bg-red-500",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getActionColor = (color: string) => {
    const colors = {
      blue: "border-blue-300 hover:border-blue-500 hover:bg-blue-50 group-hover:text-blue-700",
      green:
        "border-green-300 hover:border-green-500 hover:bg-green-50 group-hover:text-green-700",
      purple:
        "border-purple-300 hover:border-purple-500 hover:bg-purple-50 group-hover:text-purple-700",
      orange:
        "border-orange-300 hover:border-orange-500 hover:bg-orange-50 group-hover:text-orange-700",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getActionIconColor = (color: string) => {
    const colors = {
      blue: "text-gray-400 group-hover:text-blue-500",
      green: "text-gray-400 group-hover:text-green-500",
      purple: "text-gray-400 group-hover:text-purple-500",
      orange: "text-gray-400 group-hover:text-orange-500",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const hasAccess = (roles: string[]) => {
    return user && roles.includes(user.role);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dobrodošli nazad, {user?.name}
          </h1>
          <p className="text-gray-600 mt-1">
            Evo šta se dešava u vašem turističkom poslovanju danas.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${getStatColor(stat.color)}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Brze akcije</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              if (!hasAccess(action.roles)) return null;

              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.path}
                  className={`p-4 border-2 border-dashed rounded-lg transition-colors group ${getActionColor(
                    action.color
                  )}`}
                >
                  <div className="flex justify-center items-center h-12 mb-3">
                    <Icon
                      className={`w-8 h-8 ${getActionIconColor(action.color)}`}
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1 text-center">
                    {action.title}
                  </p>
                  <p className="text-xs text-gray-500 text-center">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
