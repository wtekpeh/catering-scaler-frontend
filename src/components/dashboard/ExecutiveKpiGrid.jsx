import DashboardStatCard from "./DashboardStatCard";

const ExecutiveKpiGrid = ({ summary }) => {
  if (!summary) {
    return null;
  }

  const items = [
    {
      title: "Total Users",
      value: summary.totalUsers ?? 0,
    },
    {
      title: "Active Users",
      value: summary.activeUsers ?? 0,
    },
    {
      title: "Total Branches",
      value: summary.totalBranches ?? 0,
    },
    {
      title: "Total Batches",
      value: summary.totalBatches ?? 0,
    },
    {
      title: "Batches This Week",
      value: summary.batchesThisWeek ?? 0,
    },
    {
      title: "Batches This Month",
      value: summary.batchesThisMonth ?? 0,
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
