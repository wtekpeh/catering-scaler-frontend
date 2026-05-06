const ExecutiveHighlightsPanel = ({ data }) => {
  if (!data) {
    return (
      <div className="dashboard-chart-card">
        <div className="dashboard-chart-card__header">
          <h3 className="dashboard-chart-card__title">
            Operational Highlights
          </h3>
          <p className="dashboard-chart-card__subtitle">
            No highlight data available.
          </p>
        </div>
      </div>
    );
  }

  const items = [
    {
      label: "Most Active Site",
      value: data.mostActiveBranch || "-",
    },
    {
      label: "Largest Site",
      value: data.largestBranch || "-",
    },
    {
      label: "Peak Site Day",
      value: data.peakBatchDay || "-",
    },
    {
      label: "Most Used Recipe",
      value: data.mostUsedRecipe || "-",
    },
    {
      label: "Average Consumptions / Site",
      value:
        data.averageBatchesPerBranch !== undefined
          ? data.averageBatchesPerBranch
          : "-",
    },
  ];

  return (
    <div className="dashboard-chart-card">
      <div className="dashboard-chart-card__header">
        <h3 className="dashboard-chart-card__title">Operational Highlights</h3>
        <p className="dashboard-chart-card__subtitle">
          Quick executive insights from recent activity.
        </p>
      </div>

      <div className="dashboard-highlights-grid">
        {items.map((item) => (
          <div key={item.label} className="dashboard-highlight-tile">
            <p className="dashboard-highlight-tile__label">{item.label}</p>
            <h4 className="dashboard-highlight-tile__value">{item.value}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutiveHighlightsPanel;
