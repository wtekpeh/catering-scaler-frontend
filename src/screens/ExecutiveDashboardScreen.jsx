import { useEffect } from "react";
import "../styles/dashboard.css";
import {
  getExecutiveSummary,
  getBatchTrends,
  getStaffSummary,
  getBranchSummary,
  getRecentBatches,
  getBranches,
  getIngredientCategoryDaily,
} from "../api/dashboardApi";
import ExecutiveKpiGrid from "../components/dashboard/ExecutiveKpiGrid";
import { useDashboardFilterStore } from "../stores/dashboard/useDashboardFilterStore";
import { useExecutiveDashboardStore } from "../stores/dashboard/useExecutiveDashboardStore";
import ExecutiveBatchTrendChart from "../components/dashboard/ExecutiveBatchTrendChart";
import ExecutiveUserTrendChart from "../components/dashboard/ExecutiveUserTrendChart";
import ExecutiveBranchPerformance from "../components/dashboard/ExecutiveBranchPerformance";
import ExecutiveRoleDistribution from "../components/dashboard/ExecutiveRoleDistribution";
import ExecutiveHighlightsPanel from "../components/dashboard/ExecutiveHighlightsPanel";
import ExecutiveRecentBatchesTable from "../components/dashboard/ExecutiveRecentBatchesTable";
import DashboardFilterBar from "../components/dashboard/DashboardFilterBar";
import DashboardLoadingBlock from "../components/dashboard/DashboardLoadingBlock";
import DashboardErrorBlock from "../components/dashboard/DashboardErrorBlock";
import IngredientCategoryDailyTable from "../components/dashboard/IngredientCategoryDailyTable";

const ExecutiveDashboardScreen = () => {
  const { startDate, endDate, branchId, groupBy, setBranches } =
    useDashboardFilterStore();

  const {
    summary,
    batchTrends,
    userTrends,
    branchSummary,
    roleSummary,
    highlights,
    recentBatches,
    loading,
    error,
    setLoading,
    setError,
    setExecutiveDashboardData,
    ingredientCategoryDaily,
    setIngredientCategoryDaily,
  } = useExecutiveDashboardStore();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const filters = {
          startDate,
          endDate,
          branchId,
          groupBy,
        };

        const reportDate =
          endDate || startDate || new Date().toISOString().split("T")[0];

        const [
          executiveSummaryResponse,
          batchTrendsResponse,
          staffSummaryResponse,
          branchSummaryResponse,
          recentBatchesResponse,
          branchesResponse,
          ingredientCategoryDailyResponse,
        ] = await Promise.all([
          getExecutiveSummary(filters),
          getBatchTrends(filters),
          getStaffSummary(filters),
          getBranchSummary(filters),
          getRecentBatches(filters),
          getBranches(),
          getIngredientCategoryDaily(reportDate),
        ]);

        setBranches(branchesResponse.branches || []);

        setExecutiveDashboardData({
          summary: executiveSummaryResponse.summary,
          highlights: executiveSummaryResponse.highlights,
          batchTrends: batchTrendsResponse.batchTrends,
          userTrends: staffSummaryResponse.userTrends,
          branchSummary: branchSummaryResponse.branchSummary,
          roleSummary: staffSummaryResponse.roleSummary,
          recentBatches: recentBatchesResponse.recentBatches,
        });

        setIngredientCategoryDaily(
          ingredientCategoryDailyResponse.ingredientCategoryDaily || [],
        );
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
            err?.message ||
            "Failed to load dashboard data.",
        );
      }
    };

    loadDashboard();
  }, [
    startDate,
    endDate,
    branchId,
    groupBy,
    setLoading,
    setError,
    setExecutiveDashboardData,
    setBranches,
    setIngredientCategoryDaily,
  ]);

  return (
    <div className="dashboard-screen">
      <div className="dashboard-screen__header">
        <h1 className="dashboard-screen__title">Executive Dashboard</h1>
        <p className="dashboard-screen__subtitle">
          Overview of users, branches, and cooking activity.
        </p>
      </div>

      <DashboardFilterBar />

      {loading && (
        <DashboardLoadingBlock message="Loading executive dashboard..." />
      )}

      {error && <DashboardErrorBlock message={error} />}

      {!loading && !error && (
        <>
          <ExecutiveKpiGrid summary={summary} />

          <div className="dashboard-two-column-grid">
            <ExecutiveBatchTrendChart data={batchTrends} />
            <ExecutiveUserTrendChart data={userTrends} />
          </div>

          <div className="dashboard-two-column-grid">
            <ExecutiveBranchPerformance data={branchSummary} />
            <ExecutiveRoleDistribution data={roleSummary} />
          </div>

          <div className="dashboard-two-column-grid">
            <ExecutiveHighlightsPanel data={highlights} />
            <ExecutiveRecentBatchesTable data={recentBatches} />
          </div>

          <div className="dashboard-two-column-grid">
            <IngredientCategoryDailyTable data={ingredientCategoryDaily} />
          </div>
        </>
      )}
    </div>
  );
};

export default ExecutiveDashboardScreen;
