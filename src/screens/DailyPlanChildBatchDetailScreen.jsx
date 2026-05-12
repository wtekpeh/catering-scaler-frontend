import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { getDailyConsumptionPlanChildDetail } from "../actions/cookBatchActions";

const DailyPlanChildBatchDetailScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { planId, batchId } = useParams();

  const childDetail = useSelector(
    (state) => state.dailyConsumptionPlanChildDetail,
  );

  const { loading, error, batch = null } = childDetail || {};

  useEffect(() => {
    dispatch(getDailyConsumptionPlanChildDetail(planId, batchId));
  }, [dispatch, planId, batchId]);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h2 className="page-title">
              Daily Plan Child Consumption #{batch?.id || batchId}
            </h2>

            <p className="page-subtitle">
              Recipe-level prediction breakdown under Daily Plan #{planId}.
            </p>
          </div>

          <div className="actions">
            <button
              type="button"
              className="btn"
              onClick={() => navigate(`/cooking/daily-plans/${planId}`)}
            >
              Back to Daily Plan
            </button>
          </div>
        </div>

        {loading && <p>Loading child consumption...</p>}

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        {!loading && !error && batch && (
          <>
            <div className="detail-summary-grid">
              <div className="detail-summary-item">
                <span className="detail-summary-label">Recipe</span>
                <span className="detail-summary-value">
                  {batch.recipe_name || "-"}
                </span>
              </div>

              <div className="detail-summary-item">
                <span className="detail-summary-label">Site</span>
                <span className="detail-summary-value">
                  {batch.branch_name || "-"}
                </span>
              </div>

              <div className="detail-summary-item">
                <span className="detail-summary-label">People</span>
                <span className="detail-summary-value">
                  {batch.n_people || "-"}
                </span>
              </div>

              <div className="detail-summary-item">
                <span className="detail-summary-label">Used Date</span>
                <span className="detail-summary-value">
                  {formatDate(batch.used_date)}
                </span>
              </div>

              <div className="detail-summary-item">
                <span className="detail-summary-label">Protein</span>
                <span className="detail-summary-value">
                  {batch.protein_type || "-"}
                </span>
              </div>

              <div className="detail-summary-item">
                <span className="detail-summary-label">Status</span>
                <span className="detail-summary-value">
                  {batch.status || "-"}
                </span>
              </div>
            </div>

            {batch.notes ? (
              <div className="detail-note-box">
                <b>Notes:</b> {batch.notes}
              </div>
            ) : null}

            <div className="card pad stack-14" style={{ marginTop: 16 }}>
              <h3 style={{ marginTop: 0 }}>Prediction Breakdown</h3>

              <div className="desktop-only">
                <div className="table-wrap">
                  <table className="table table--detail">
                    <thead>
                      <tr>
                        <th>Ingredient</th>
                        <th>Group</th>
                        <th>Unit</th>
                        <th>Pred</th>
                        <th>Final</th>
                        <th>Clamped?</th>
                      </tr>
                    </thead>

                    <tbody>
                      {(batch.items || []).map((item) => {
                        const config = getDisplayConfig(item.ingredient);

                        return (
                          <tr key={item.id}>
                            <td>
                              <div className="cell-title">
                                {item.ingredient}
                              </div>
                            </td>
                            <td>{item.group || "-"}</td>
                            <td>{config.unit}</td>
                            <td>
                              {formatDisplayKg(item.pred_kg, config)}{" "}
                              {config.unit}
                            </td>
                            <td>
                              {formatDisplayKg(item.final_kg, config)}{" "}
                              {config.unit}
                            </td>
                            <td>{item.was_clamped ? "Yes" : "No"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mobile-only">
                <div className="batch-cards">
                  {(batch.items || []).map((item) => {
                    const config = getDisplayConfig(item.ingredient);

                    return (
                      <div key={item.id} className="batch-card">
                        <div className="batch-card__title">
                          {item.ingredient}
                        </div>

                        <div className="batch-card__meta">
                          <div>
                            <b>Group:</b> {item.group || "-"}
                          </div>

                          <div>
                            <b>Pred:</b> {formatDisplayKg(item.pred_kg, config)}{" "}
                            {config.unit}
                          </div>

                          <div>
                            <b>Final:</b>{" "}
                            {formatDisplayKg(item.final_kg, config)}{" "}
                            {config.unit}
                          </div>

                          <div>
                            <b>Clamped:</b> {item.was_clamped ? "Yes" : "No"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

function formatDate(value) {
  if (!value) return "-";

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return value;

  return d.toLocaleDateString();
}

function getDisplayConfig(ingredientName = "") {
  const name = String(ingredientName || "").toLowerCase();

  if (name.includes("oil")) {
    return {
      unit: "L",
      kgToDisplay: (kg) => Number(kg || 0),
    };
  }

  if (name.includes("kenkey")) {
    return {
      unit: "pc",
      kgToDisplay: (kg) => Number(kg || 0) * 1000,
    };
  }

  return {
    unit: "kg",
    kgToDisplay: (kg) => Number(kg || 0),
  };
}

function formatDisplayKg(valueKg, config) {
  if (valueKg === null || valueKg === undefined) return "-";

  const value = config.kgToDisplay(valueKg);

  if (!Number.isFinite(value)) return "-";

  if (config.unit === "pc") return value.toFixed(0);

  return value.toFixed(2);
}

export default DailyPlanChildBatchDetailScreen;
