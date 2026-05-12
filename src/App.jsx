import { useEffect } from "react";

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
import DailyConsumptionPlanCreateScreen from "./screens/DailyConsumptionPlanCreateScreen";
import DailyConsumptionPlanListScreen from "./screens/DailyConsumptionPlanListScreen";
import DailyConsumptionPlanDetailScreen from "./screens/DailyConsumptionPlanDetailScreen";
import DailyPlanChildBatchDetailScreen from "./screens/DailyPlanChildBatchDetailScreen";

import AdminUserScreen from "./screens/AdminUserScreen";
import BranchList from "./components/accounts/branches/BranchList";

//Dashboards
import ExecutiveDashboardScreen from "./screens/ExecutiveDashboardScreen";

//Branch Managers
import BranchDashboardScreen from "./screens/BranchDashboardScreen";

//Notifications

import useNotificationSocket from "./hooks/useNotificationSocket";
import { getNotifications, getUnreadCount } from "./api/notificationApi";
import { useNotificationStore } from "./stores/dashboard/useNotificationStore";
import NotificationsScreen from "./screens/NotificationsScreen";

//Recipe Management Screen
import RecipeManagementScreen from "./screens/RecipeManagementScreen";
import RecipeListScreen from "./screens/RecipeListScreen";
import RecipeCSVUploadScreen from "./screens/RecipeCSVUploadScreen";
import RecipeDetailScreen from "./screens/RecipeDetailScreen";
import GlobalOnlyRoute from "./components/routes/GlobalOnlyRoute";
import IngredientCategoryManagementScreen from "./screens/IngredientCategoryManagementScreen";

function AppLayout() {
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);
  const setLoading = useNotificationStore((s) => s.setLoading);
  const setError = useNotificationStore((s) => s.setError);

  useNotificationSocket();

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);

        const [listRes, countRes] = await Promise.all([
          getNotifications(),
          getUnreadCount(),
        ]);

        setNotifications(listRes.items);
        setUnreadCount(countRes.unreadCount);
      } catch (err) {
        setError(err.message || "failed to load notifications");
      }
    };

    loadNotifications();
  }, [setNotifications, setUnreadCount, setLoading, setError]);

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
            path="/recipes"
            element={
              <GlobalOnlyRoute>
                <RecipeManagementScreen />
              </GlobalOnlyRoute>
            }
          />

          <Route
            path="/recipes/list"
            element={
              <GlobalOnlyRoute>
                <RecipeListScreen />
              </GlobalOnlyRoute>
            }
          />

          <Route
            path="/recipes/upload"
            element={
              <GlobalOnlyRoute>
                <RecipeCSVUploadScreen />
              </GlobalOnlyRoute>
            }
          />

          <Route
            path="/recipes/:id"
            element={
              <GlobalOnlyRoute>
                <RecipeDetailScreen />
              </GlobalOnlyRoute>
            }
          />

          <Route
            path="/ingredients/categories"
            element={<IngredientCategoryManagementScreen />}
          />

          <Route
            path="/cooking/batches/create"
            element={<CookBatchCreateScreen />}
          />
          <Route
            path="/cooking/daily-plans/create"
            element={<DailyConsumptionPlanCreateScreen />}
          />
          <Route
            path="/cooking/daily-plans"
            element={<DailyConsumptionPlanListScreen />}
          />
          <Route
            path="/cooking/daily-plans/:id"
            element={<DailyConsumptionPlanDetailScreen />}
          />
          <Route
            path="/cooking/daily-plans/:planId/children/:batchId"
            element={<DailyPlanChildBatchDetailScreen />}
          />
          <Route
            path="/cooking/batches/:id"
            element={<CookBatchDetailScreen />}
          />

          {/* Admin Ui */}
          <Route path="/admin/users" element={<AdminUserScreen />} />
          <Route path="/admin/branches" element={<BranchList />} />
          <Route path="/branch/staff" element={<AdminUserScreen />} />

          <Route path="/dashboard" element={<ExecutiveDashboardScreen />} />
          <Route path="/branch-dashboard" element={<BranchDashboardScreen />} />
          <Route path="/notifications" element={<NotificationsScreen />} />

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
