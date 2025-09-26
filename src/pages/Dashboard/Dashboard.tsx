// components/Dashboard/Dashboard.tsx
import React, { useMemo, useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  FileText,
  Archive,
  DollarSign,
  Users,
  Calendar,
  Plus,
  CreditCard,
} from "lucide-react";
import StatCard from "./StatCard";
import QuickActionCard from "./QuickActionCard";
import { getStats } from "../../api/offer";

type StatColor = "blue" | "yellow" | "green" | "red";
type ActionColor = "blue" | "green" | "purple" | "orange";

type Stat = {
  title: string;
  value: string;
  icon: React.ElementType;
  color: StatColor;
};

type QuickAction = {
  title: string;
  description: string;
  icon: React.ElementType;
  color: ActionColor;
  path: string;
  roles: string[];
};

const quickActions: QuickAction[] = [
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

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await getStats();
        setStats([
          {
            title: "Ukupno ponuda",
            value: res.ukupno_ponuda.toString(),
            icon: FileText,
            color: "blue",
          },
          {
            title: "Potrebno praćenje",
            value: res.za_pracenje.toString(),
            icon: Archive,
            color: "yellow",
          },
          {
            title: "Prihvaćene ponude",
            value: res.prihvaceno.toString(),
            icon: FileText,
            color: "green",
          },
          {
            title: "Neizmirena dugovanja",
            value: `€${res.ukupno_dugovanja.toLocaleString()}`,
            icon: DollarSign,
            color: "red",
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    }
    fetchStats();
  }, []);

  const accessibleActions = useMemo(
    () => quickActions.filter((a) => user && a.roles.includes(user.role)),
    [user]
  );

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {accessibleActions.length > 0 && (
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Brze akcije</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {accessibleActions.map((a, i) => (
                <QuickActionCard key={i} {...a} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
