import DashboardStatCard from "./DashboardStatCard";

const defaultLabels = {
  totalUsers: "Total Users",
  activeUsers: "Active Users",
  totalBranches: "Total Sites",

  totalBatches: "Total Consumptions",
  batchesThisWeek: "Consumptions This Week",
  batchesThisMonth: "Consumptions This Month",

  totalDailyPlans: "Total Daily Plans",
  finalizedDailyPlans: "Finalized Daily Plans",
  draftDailyPlans: "Draft Daily Plans",
};
const ExecutiveKpiGrid = ({ summary, labels = defaultLabels }) => {
  if (!summary) {
    return null;
  }

  const items = [
    {
      title: labels.totalUsers,
      value: summary.totalUsers ?? 0,
    },
    {
      title: labels.activeUsers,
      value: summary.activeUsers ?? 0,
    },
    {
      title: labels.totalBranches,
      value: summary.totalBranches ?? 0,
    },
    {
      title: labels.totalBatches,
      value: summary.totalBatches ?? 0,
    },
    {
      title: labels.batchesThisWeek,
      value: summary.batchesThisWeek ?? 0,
    },
    {
      title: labels.batchesThisMonth,
      value: summary.batchesThisMonth ?? 0,
    },
    {
      title: labels.totalDailyPlans,
      value: summary.totalDailyPlans ?? 0,
    },
    {
      title: labels.finalizedDailyPlans,
      value: summary.finalizedDailyPlans ?? 0,
    },
    {
      title: labels.draftDailyPlans,
      value: summary.draftDailyPlans ?? 0,
    },
  ];

  return (
    <div className="dashboard-kpi-grid">
      {items.map((item) => (
        <DashboardStatCard
          key={item.title}
          title={item.title}
          value={item.value}
        />
      ))}
    </div>
  );
};

export default ExecutiveKpiGrid;
