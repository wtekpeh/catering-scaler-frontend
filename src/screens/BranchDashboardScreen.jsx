import { useEffect } from "react";
import "../styles/dashboard.css";

import {
  getBranchDashboardSummary,
  getBranchBatchTrends,
  getBranchDailyPlanTrends,
  getBranchRoleDistribution,
  getBranchRecentBatches,
} from "../api/branchDashboardApi";

import { useBranchDashboardStore } from "../stores/dashboard/useBranchDashboardStore";

import DashboardLoadingBlock from "../components/dashboard/DashboardLoadingBlock";
import DashboardErrorBlock from "../components/dashboard/DashboardErrorBlock";

// We will reuse KPI grid (important)
import ExecutiveKpiGrid from "../components/dashboard/ExecutiveKpiGrid";
import ExecutiveBatchTrendChart from "../components/dashboard/ExecutiveBatchTrendChart";
import ExecutiveRoleDistribution from "../components/dashboard/ExecutiveRoleDistribution";
import ExecutiveRecentBatchesTable from "../components/dashboard/ExecutiveRecentBatchesTable";
import ExecutiveDailyPlanTrendChart from "../components/dashboard/ExecutiveDailyPlanTrendChart";
import ExecutiveRecentDailyPlansTable from "../components/dashboard/ExecutiveRecentDailyPlansTable";

const BranchDashboardScreen = () => {
  const {
    summary,
    batchTrends,
    dailyPlanTrends,
    roleSummary,
    recentBatches,
    recentDailyPlans,
    loading,
    error,
    setLoading,
    setError,
    setSummary,
    setBatchTrends,
    setDailyPlanTrends,
    setRoleSummary,
    setRecentBatches,
    setRecentDailyPlans,
  } = useBranchDashboardStore();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [
          summaryResponse,
          batchTrendsResponse,
          dailyPlanTrendsResponse,
          roleDistributionResponse,
          recentBatchesResponse,
        ] = await Promise.all([
          getBranchDashboardSummary(),
          getBranchBatchTrends(),
          getBranchDailyPlanTrends(),
          getBranchRoleDistribution(),
          getBranchRecentBatches(),
        ]);
        setSummary({
          totalUsers: summaryResponse.kpis.total_staff,
          activeUsers: summaryResponse.kpis.total_staff,
          totalBranches: 1,
          totalBatches: summaryResponse.kpis.total_batches,
          batchesThisWeek: summaryResponse.kpis.batches_this_week,
          batchesThisMonth: summaryResponse.kpis.batches_this_month,
          totalDailyPlans: summaryResponse.kpis.total_daily_plans,
          finalizedDailyPlans: summaryResponse.kpis.finalized_daily_plans,
          draftDailyPlans: summaryResponse.kpis.draft_daily_plans,
        });

        setBatchTrends(batchTrendsResponse.series || []);

        setRoleSummary({
          branchRoles: roleDistributionResponse.branchRoles || [],
        });

        setDailyPlanTrends(dailyPlanTrendsResponse.series || []);
        setRecentDailyPlans(summaryResponse.recent_daily_plans || []);

        setRecentBatches(
          (recentBatchesResponse.items || []).map((item) => ({
            id: item.batch_id,
            recipeName: item.recipe_name,
            branchName: item.branch_name,
            createdBy: item.created_by,
            createdAt: item.created_at,
          })),
        );
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
            err?.message ||
            "Failed to load branch dashboard.",
        );
      }
    };

    loadDashboard();
  }, [
    setLoading,
    setError,
    setSummary,
    setBatchTrends,
    setRoleSummary,
    setRecentBatches,
    setDailyPlanTrends,
    setRecentDailyPlans,
  ]);

  return (
    <div className="dashboard-screen">
      <div className="dashboard-screen__header">
        <h1 className="dashboard-screen__title">Site Dashboard</h1>
        <p className="dashboard-screen__subtitle">
          Overview of your site performance.
        </p>
      </div>

      {loading && <DashboardLoadingBlock message="Loading site dashboard..." />}

      {error && <DashboardErrorBlock message={error} />}

      {!loading && !error && (
        <>
          <ExecutiveKpiGrid
            summary={summary}
            labels={{
              totalUsers: "Total Staff",
              activeUsers: "Active Staff",
              totalBranches: "Assigned Sites",
              totalBatches: "Total Consumptions",
              batchesThisWeek: "Consumptions This Week",
              batchesThisMonth: "Consumptions This Month",
              totalDailyPlans: "Total Daily Plans",
              finalizedDailyPlans: "Finalized Daily Plans",
              draftDailyPlans: "Draft Daily Plans",
            }}
          />

          <div className="dashboard-two-column-grid">
            <ExecutiveBatchTrendChart data={batchTrends} />
            <ExecutiveDailyPlanTrendChart data={dailyPlanTrends} />
          </div>

          <div className="dashboard-two-column-grid">
            <ExecutiveRoleDistribution data={roleSummary} />
            <ExecutiveRecentDailyPlansTable plans={recentDailyPlans} />
          </div>

          <div className="dashboard-two-column-grid">
            <ExecutiveRecentBatchesTable data={recentBatches} />
          </div>
        </>
      )}
    </div>
  );
};

export default BranchDashboardScreen;
