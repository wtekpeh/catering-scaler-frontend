const ExecutiveTopRecipeVariance = ({ items = [] }) => {
  return (
    <section className="dashboard-chart-card">
      <div className="dashboard-chart-card__header">
        <h2 className="dashboard-chart-card__title">Top Recipe Variance</h2>
        <p className="dashboard-chart-card__subtitle">
          Recipes with the highest average difference between final prediction
          and actual usage.
        </p>
      </div>

      <div className="dashboard-table-wrapper">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Recipe</th>
              <th>Avg Variance</th>
              <th>Batches</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="3">No variance data yet.</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.recipe_id}>
                  <td className="dashboard-table__primary-cell">
                    {item.recipe_name}
                  </td>
                  <td>{formatGramValue(item.average_variance_g)}</td>
                  <td>{item.total_batches}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const formatGramValue = (value) => {
  const num = Number(value || 0);

  if (!Number.isFinite(num)) return "-";

  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)} kg`;
  }

  return `${num.toFixed(2)} g`;
};

export default ExecutiveTopRecipeVariance;
