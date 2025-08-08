import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CMSProvider } from "./contexts/CMSContext";
import AppRoutes from "./router";

function App() {
  return (
    <AuthProvider>
      <CMSProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <AppRoutes />
          </div>
        </Router>
      </CMSProvider>
    </AuthProvider>
  );
}

export default App;
