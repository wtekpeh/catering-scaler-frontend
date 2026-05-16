import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const ExecutiveDailyPlanTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="dashboard-chart-card">
        <div className="dashboard-chart-card__header">
          <h3 className="dashboard-chart-card__title">
            Daily Plan Activity Trend
          </h3>

          <p className="dashboard-chart-card__subtitle">
            No daily plan trend data available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-chart-card">
      <div className="dashboard-chart-card__header">
        <h3 className="dashboard-chart-card__title">
          Daily Plan Activity Trend
        </h3>

        <p className="dashboard-chart-card__subtitle">
          Daily operational planning activity across the selected period.
        </p>
      </div>

      <div className="dashboard-chart-card__body">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148, 163, 184, 0.15)"
            />

            <XAxis
              dataKey="label"
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
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

            <Line
              type="monotone"
              dataKey="count"
              name="Daily Plans"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExecutiveDailyPlanTrendChart;
