import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const ExecutiveBranchPerformance = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="dashboard-chart-card">
        <div className="dashboard-chart-card__header">
          <h3 className="dashboard-chart-card__title">Branch Performance</h3>
          <p className="dashboard-chart-card__subtitle">
            No branch performance data available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-chart-card">
      <div className="dashboard-chart-card__header">
        <h3 className="dashboard-chart-card__title">Branch Performance</h3>
        <p className="dashboard-chart-card__subtitle">
          Batch output by branch.
        </p>
      </div>

      <div className="dashboard-chart-card__body">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148, 163, 184, 0.15)"
            />
            <XAxis
              dataKey="branchName"
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                borderRadius: "12px",
                color: "#f8fafc",
              }}
              labelStyle={{ color: "#cbd5e1" }}
            />
            <Bar dataKey="batchCount" fill="#60a5fa" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExecutiveBranchPerformance;
