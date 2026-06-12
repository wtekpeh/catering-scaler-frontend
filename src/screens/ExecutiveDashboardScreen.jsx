import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import {
  getExecutiveSummary,
  getBatchTrends,
  getDailyPlanTrends,
  getStaffSummary,
  getBranchSummary,
  getRecentBatches,
  getRecentDailyPlans,
  getBranches,
  getIngredientCategoryDaily,
  getTopRecipeVariance,
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
import ExecutiveTopRecipeVariance from "../components/dashboard/ExecutiveTopRecipeVariance";
import ExecutiveDailyPlanTrendChart from "../components/dashboard/ExecutiveDailyPlanTrendChart";
import ExecutiveRecentDailyPlansTable from "../components/dashboard/ExecutiveRecentDailyPlansTable";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const ExecutiveDashboardScreen = () => {
  const { startDate, endDate, branchId, groupBy, setBranches } =
    useDashboardFilterStore();
  const [ingredientStartDate, setIngredientStartDate] =
    useState(getTodayDate());

  const [ingredientEndDate, setIngredientEndDate] = useState(getTodayDate());

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
    topRecipeVariance,
    setTopRecipeVariance,
    dailyPlanTrends,
    recentDailyPlans,
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

        const [
          executiveSummaryResponse,
          batchTrendsResponse,
          dailyPlanTrendsResponse,
          staffSummaryResponse,
          branchSummaryResponse,
          recentBatchesResponse,
          recentDailyPlansResponse,
          branchesResponse,
          topRecipeVarianceResponse,
        ] = await Promise.all([
          getExecutiveSummary(filters),
          getBatchTrends(filters),
          getDailyPlanTrends(filters),
          getStaffSummary(filters),
          getBranchSummary(filters),
          getRecentBatches(filters),
          getRecentDailyPlans(filters),
          getBranches(),
          getTopRecipeVariance(filters),
        ]);

        setBranches(branchesResponse.branches || []);
        setTopRecipeVariance(topRecipeVarianceResponse.topRecipeVariance || []);

        setExecutiveDashboardData({
          summary: executiveSummaryResponse.summary,
          highlights: executiveSummaryResponse.highlights,
          batchTrends: batchTrendsResponse.batchTrends,
          dailyPlanTrends: dailyPlanTrendsResponse.dailyPlanTrends,
          userTrends: staffSummaryResponse.userTrends,
          branchSummary: branchSummaryResponse.branchSummary,
          roleSummary: staffSummaryResponse.roleSummary,
          recentBatches: recentBatchesResponse.recentBatches,
          recentDailyPlans: recentDailyPlansResponse.recentDailyPlans,
        });
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
    setTopRecipeVariance,
  ]);

  useEffect(() => {
    const loadIngredientCategoryDaily = async () => {
      try {
        const start = ingredientStartDate || getTodayDate();
        const end = ingredientEndDate || getTodayDate();

        const response = await getIngredientCategoryDaily(start, end);

        setIngredientCategoryDaily(response.ingredientCategoryDaily || []);
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
            err?.message ||
            "Failed to load ingredient category report.",
        );
      }
    };

    loadIngredientCategoryDaily();
  }, [
    ingredientStartDate,
    ingredientEndDate,
    setIngredientCategoryDaily,
    setError,
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
            <ExecutiveDailyPlanTrendChart data={dailyPlanTrends} />
            <ExecutiveRecentDailyPlansTable plans={recentDailyPlans} />
          </div>

          <div className="dashboard-two-column-grid">
            <ExecutiveBranchPerformance data={branchSummary} />
            <ExecutiveRoleDistribution data={roleSummary} />
          </div>

          <div className="dashboard-two-column-grid">
            <ExecutiveHighlightsPanel data={highlights} />
            <ExecutiveTopRecipeVariance items={topRecipeVariance} />
          </div>

          <div className="dashboard-two-column-grid">
            <ExecutiveRecentBatchesTable data={recentBatches} />
            <IngredientCategoryDailyTable
              data={ingredientCategoryDaily}
              startDate={ingredientStartDate}
              endDate={ingredientEndDate}
              onStartDateChange={setIngredientStartDate}
              onEndDateChange={setIngredientEndDate}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ExecutiveDashboardScreen;
