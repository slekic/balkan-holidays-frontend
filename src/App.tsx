import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CMSProvider } from "./contexts/CMSContext";
import AppRoutes from "./router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <CMSProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <AppRoutes />
          </div>
          <ToastContainer position="top-right" autoClose={3000} />
        </Router>
      </CMSProvider>
    </AuthProvider>
  );
}

export default App;
