import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
                  Operational variance analysis
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

        return null;
      })}
    </div>
  );
};

export default ExecutiveAIChartRenderer;
