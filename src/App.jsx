import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import CookBatchListScreen from "./screens/CookBatchListScreen";
// We'll create these next (placeholders for now so routing is ready)
import CookBatchCreateScreen from "./screens/CookBatchCreateScreen";
import CookBatchDetailScreen from "./screens/CookBatchDetailScreen";

function App() {
  return (
    <Router>
      <div style={{ padding: 12 }}>
        <Routes>
          {/* Default route */}
          <Route
            path="/"
            element={<Navigate to="/cooking/batches" replace />}
          />

          {/* 1) List */}
          <Route path="/cooking/batches" element={<CookBatchListScreen />} />

          {/* 2) Create */}
          <Route
            path="/cooking/batches/create"
            element={<CookBatchCreateScreen />}
          />

          {/* 3) Detail */}
          <Route
            path="/cooking/batches/:id"
            element={<CookBatchDetailScreen />}
          />

          {/* Fallback */}
          <Route path="*" element={<div>404 - Page not found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
