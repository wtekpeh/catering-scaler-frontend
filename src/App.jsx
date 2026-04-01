import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";

import CookBatchListScreen from "./screens/CookBatchListScreen";
import CookBatchCreateScreen from "./screens/CookBatchCreateScreen";
import CookBatchDetailScreen from "./screens/CookBatchDetailScreen";

import AdminUserScreen from "./screens/AdminUserScreen";

function AppLayout() {
  return (
    <div className="app-shell">
      <AppHeader />

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/cooking/batches" replace />}
          />
          <Route path="/cooking/batches" element={<CookBatchListScreen />} />
          <Route
            path="/cooking/batches/create"
            element={<CookBatchCreateScreen />}
          />
          <Route
            path="/cooking/batches/:id"
            element={<CookBatchDetailScreen />}
          />

          {/* Admin Ui */}
          <Route path="/admin/users" element={<AdminUserScreen />} />

          <Route
            path="*"
            element={
              <div className="page">
                <div className="container">404 - Page not found</div>
              </div>
            }
          />
        </Routes>
      </main>

      <AppFooter />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
