import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#38bdf8", "#34d399", "#f59e0b", "#f87171", "#a78bfa"];

const ExecutiveRoleDistribution = ({ data }) => {
  const chartData = data?.branchRoles || [];

  const formattedChartData = chartData.map((item) => ({
    ...item,
    role: item.role === "branch_manager" ? "project_manager" : item.role,
  }));

  if (!chartData.length) {
    return (
      <div className="dashboard-chart-card">
        <div className="dashboard-chart-card__header">
          <h3 className="dashboard-chart-card__title">Role Distribution</h3>
          <p className="dashboard-chart-card__subtitle">
            No role distribution data available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-chart-card">
      <div className="dashboard-chart-card__header">
        <h3 className="dashboard-chart-card__title">Role Distribution</h3>
        <p className="dashboard-chart-card__subtitle">
          Site-level staff role composition.
        </p>
      </div>

      <div className="dashboard-chart-card__body">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={formattedChartData}
              dataKey="count"
              nameKey="role"
              cx="50%"
              cy="50%"
              outerRadius={95}
              innerRadius={55}
              paddingAngle={4}
            >
              {formattedChartData.map((entry, index) => (
                <Cell key={entry.role} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                borderRadius: "12px",
                color: "#f8fafc",
              }}
              labelStyle={{ color: "#cbd5e1" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExecutiveRoleDistribution;
