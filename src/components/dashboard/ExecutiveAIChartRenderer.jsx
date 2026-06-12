import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const BAR_COLORS = [
  "#38bdf8",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
];

const getDatasetItems = (chartData, datasetName) => {
  const dataset = chartData?.[datasetName];

  if (!dataset) {
    return [];
  }

  if (Array.isArray(dataset)) {
    return dataset;
  }

  if (Array.isArray(dataset.items)) {
    return dataset.items;
  }

  if (Array.isArray(dataset.series)) {
    return dataset.series;
  }

  return [];
};

const shortenLabel = (value = "") => {
  const maxLength = window.innerWidth < 768 ? 10 : 18;

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
};

const formatTooltipValue = (value) => {
  if (typeof value !== "number") {
    return value;
  }

  return `${value.toFixed(2)}%`;
};

const getChartSubtitle = (datasetName) => {
  switch (datasetName) {
    case "branch_summary":
      return "Site performance analysis";

    case "site_staff_load":
      return "Site workload and staffing analysis";

    case "ingredient_variance_risk":
      return "Ingredient variance analysis";

    case "planning_risk_summary":
      return "Planning readiness analysis";

    case "management_action_summary":
      return "Management workload focus";

    default:
      return "Operational analysis";
  }
};

const ExecutiveAIChartRenderer = ({
  chartSuggestions = [],
  chartData = {},
}) => {
  const isMobile = useMemo(() => {
    return window.innerWidth < 768;
  }, []);
  if (!chartSuggestions.length) {
    return null;
  }

  return (
    <div className="ai-chart-list">
      {chartSuggestions.map((chart, index) => {
        const rawData = getDatasetItems(chartData, chart.dataset);

        const data = rawData.filter((item) => {
          const value = Number(item?.[chart.y_field] || 0);

          return value > 0;
        });

        if (!data.length) {
          return null;
        }

        if (chart.chart_type === "bar") {
          return (
            <div
              className="dashboard-chart-card ai-chart-card"
              key={`${chart.dataset}-${index}`}
            >
              <div className="dashboard-chart-card__header">
                <h3 className="dashboard-chart-card__title">{chart.title}</h3>

                <p className="dashboard-chart-card__subtitle">
                  {getChartSubtitle(chart.dataset)}
                </p>
              </div>

              <div className="dashboard-chart-card__body">
                <ResponsiveContainer width="100%" height={isMobile ? 240 : 320}>
                  <BarChart
                    data={data}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -10,
                      bottom: isMobile ? 45 : 70,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(148, 163, 184, 0.18)"
                    />

                    <XAxis
                      dataKey={chart.x_field}
                      tickFormatter={shortenLabel}
                      tick={{
                        fill: "#cbd5e1",
                        fontSize: 11,
                      }}
                      angle={isMobile ? -10 : -18}
                      textAnchor="end"
                      interval={0}
                      height={80}
                    />

                    <YAxis
                      tick={{
                        fill: "#cbd5e1",
                        fontSize: isMobile ? 9 : 11,
                      }}
                    />

                    <Tooltip
                      formatter={(value) => formatTooltipValue(value)}
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid rgba(148,163,184,0.2)",
                        borderRadius: "12px",
                        color: "#f8fafc",
                      }}
                      labelStyle={{
                        color: "#f8fafc",
                        fontWeight: 700,
                      }}
                    />

                    <Bar dataKey={chart.y_field} radius={[8, 8, 0, 0]}>
                      {data.map((entry, barIndex) => (
                        <Cell
                          key={`cell-${barIndex}`}
                          fill={BAR_COLORS[barIndex % BAR_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        }

        if (chart.chart_type === "line") {
          return (
            <div
              className="dashboard-chart-card ai-chart-card"
              key={`${chart.dataset}-${index}`}
            >
              <div className="dashboard-chart-card__header">
                <h3 className="dashboard-chart-card__title">{chart.title}</h3>

                <p className="dashboard-chart-card__subtitle">
                  {getChartSubtitle(chart.dataset)}
                </p>
              </div>

              <div className="dashboard-chart-card__body">
                <ResponsiveContainer width="100%" height={isMobile ? 240 : 320}>
                  <LineChart
                    data={data}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -10,
                      bottom: isMobile ? 35 : 55,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(148, 163, 184, 0.18)"
                    />

                    <XAxis
                      dataKey={chart.x_field}
                      tickFormatter={shortenLabel}
                      tick={{
                        fill: "#cbd5e1",
                        fontSize: isMobile ? 9 : 11,
                      }}
                      angle={isMobile ? -10 : -18}
                      textAnchor="end"
                      interval={0}
                      height={isMobile ? 55 : 80}
                    />

                    <YAxis
                      tick={{
                        fill: "#cbd5e1",
                        fontSize: isMobile ? 9 : 11,
                      }}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid rgba(148,163,184,0.2)",
                        borderRadius: "12px",
                        color: "#f8fafc",
                      }}
                      labelStyle={{
                        color: "#f8fafc",
                        fontWeight: 700,
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey={chart.y_field}
                      stroke="#38bdf8"
                      strokeWidth={3}
                      dot={{
                        r: isMobile ? 2 : 4,
                        fill: "#38bdf8",
                      }}
                      activeDot={{
                        r: isMobile ? 4 : 6,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        }

        if (chart.chart_type === "pie") {
          return (
            <div
              className="dashboard-chart-card ai-chart-card"
              key={`${chart.dataset}-${index}`}
            >
              <div className="dashboard-chart-card__header">
                <h3 className="dashboard-chart-card__title">{chart.title}</h3>

                <p className="dashboard-chart-card__subtitle">
                  {getChartSubtitle(chart.dataset)}
                </p>
              </div>

              <div className="dashboard-chart-card__body">
                <ResponsiveContainer width="100%" height={isMobile ? 260 : 340}>
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey={chart.y_field}
                      nameKey={chart.x_field}
                      cx="50%"
                      cy="50%"
                      outerRadius={isMobile ? 70 : 110}
                      label
                    >
                      {data.map((entry, pieIndex) => (
                        <Cell
                          key={`cell-${pieIndex}`}
                          fill={BAR_COLORS[pieIndex % BAR_COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid rgba(148,163,184,0.2)",
                        borderRadius: "12px",
                        color: "#f8fafc",
                      }}
                      labelStyle={{
                        color: "#f8fafc",
                        fontWeight: 700,
                      }}
                    />

                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        }

        return (
          <div
            className="dashboard-chart-card ai-chart-card"
            key={`${chart.dataset}-${index}`}
          >
            <div className="dashboard-chart-card__header">
              <h3 className="dashboard-chart-card__title">{chart.title}</h3>

              <p className="dashboard-chart-card__subtitle">
                Unsupported chart type: {chart.chart_type}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExecutiveAIChartRenderer;
