import React from "react";

const formatDisplayValue = (value, unit) => {
  const n = Number(value || 0);

  if (unit === "pc") return `${n.toFixed(0)} pc`;

  if (unit === "ml") {
    if (n >= 1000) return `${(n / 1000).toFixed(2)} L`;
    return `${n.toFixed(0)} ml`;
  }

  if (unit === "g") {
    if (n >= 1000) return `${(n / 1000).toFixed(2)} kg`;
    return `${n.toFixed(0)} g`;
  }

  return `${n}`;
};

const formatBaseValue = (value, unit) => {
  const n = Number(value || 0);

  if (unit === "pc") return `${n.toFixed(0)} pc`;
  if (unit === "ml") return `${n.toFixed(0)} ml`;
  if (unit === "g") return `${n.toFixed(0)} g`;

  return `${n}`;
};

const IngredientCategoryDailyTable = ({ data = [] }) => {
  return (
    <div className="dashboard-chart-card">
      <div className="dashboard-chart-card__header">
        <h3 className="dashboard-chart-card__title">
          Ingredient Category Report
        </h3>
        <p className="dashboard-chart-card__subtitle">
          Aggregated ingredient usage by category based on used date.
        </p>
      </div>

      <div className="dashboard-chart-card__body">
        {!data || data.length === 0 ? (
          <div className="dashboard-feedback">
            <p className="dashboard-feedback__text">
              No ingredient category data for selected date.
            </p>
          </div>
        ) : (
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Unit</th>
                  <th>Total Final</th>
                  <th>Total Actual</th>
                  <th>Base Final</th>
                  <th>Base Actual</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => (
                  <tr key={`${item.category_name}-${item.unit}-${index}`}>
                    <td className="dashboard-table__primary-cell">
                      {item.category_name}
                    </td>
                    <td>{item.unit}</td>
                    <td>
                      {formatDisplayValue(item.total_final_value, item.unit)}
                    </td>
                    <td>
                      {formatDisplayValue(item.total_actual_value, item.unit)}
                    </td>
                    <td>
                      {formatBaseValue(item.total_final_value, item.unit)}
                    </td>
                    <td>
                      {formatBaseValue(item.total_actual_value, item.unit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientCategoryDailyTable;
