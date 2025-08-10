import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./components/Auth/LoginPage";
import MainLayout from "./components/Layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import CMSLayout from "./components/CMS/CMSLayout";
import Hotels from "./pages/CMS/Hotels";
import Restaurants from "./pages/CMS/Restaurants";
import TransportPage from "./pages/CMS/Transport";
import Translators from "./pages/CMS/Translators";
import Guides from "./pages/CMS/Guides";
import Activities from "./pages/CMS/Activities";
import Gifts from "./pages/CMS/Gifts";
import Clients from "./pages/CMS/Clients";
import DayTemplates from "./pages/CMS/DayTemplates";
import AllOffers from "./pages/Archive/AllOffers";
import FollowUpOffers from "./pages/Archive/FollowUpOffers";
import Trash from "./pages/Archive/Trash";
import FinanceArchive from "./pages/Finance/Archive";
import Expenses from "./pages/Finance/Expenses";
import Payments from "./pages/Finance/Payments";
import Debts from "./pages/Finance/Debts";
import UserManagement from "./pages/UserManagement/UserManagement";
import OfferCreation from "./pages/OfferCreation/OfferCreation";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Offer Creation */}
        <Route
          path="offer-creation"
          element={
            <ProtectedRoute requiredRoles={["Admin", "Operation"]}>
              <OfferCreation />
            </ProtectedRoute>
          }
        />

        {/* CMS Routes */}
        <Route
          path="cms"
          element={
            <ProtectedRoute requiredRoles={["Admin", "Operation"]}>
              <CMSLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="hotels" replace />} />
          <Route path="hotels" element={<Hotels />} />
          <Route path="restaurants" element={<Restaurants />} />
          <Route path="transport" element={<TransportPage />} />
          <Route path="translators" element={<Translators />} />
          <Route path="guides" element={<Guides />} />
          <Route path="activities" element={<Activities />} />
          <Route path="gifts" element={<Gifts />} />
          <Route path="clients" element={<Clients />} />
          <Route path="day-templates" element={<DayTemplates />} />
        </Route>

        {/* Archive Routes */}
        <Route
          path="archive/*"
          element={
            <ProtectedRoute requiredRoles={["Admin", "Operation"]}>
              <Routes>
                <Route index element={<Navigate to="all" replace />} />
                <Route path="all" element={<AllOffers />} />
                <Route path="follow-up" element={<FollowUpOffers />} />
                <Route path="trash" element={<Trash />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Finance Routes */}
        <Route
          path="finance/*"
          element={
            <ProtectedRoute requiredRoles={["Admin", "Finance"]}>
              <Routes>
                <Route index element={<Navigate to="archive" replace />} />
                <Route path="archive" element={<FinanceArchive />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="payments" element={<Payments />} />
                <Route path="debts" element={<Debts />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* User Management */}
        <Route
          path="users"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
