import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { getDailyConsumptionPlanDetail } from "../actions/cookBatchActions";

const DailyConsumptionPlanDetailScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const dailyConsumptionPlanDetail = useSelector(
    (state) => state.dailyConsumptionPlanDetail,
  );

  const { loading, error, plan = null } = dailyConsumptionPlanDetail || {};

  useEffect(() => {
    dispatch(getDailyConsumptionPlanDetail(id));
  }, [dispatch, id]);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h2 className="page-title">
              Daily Consumption Plan #{plan?.id || id}
            </h2>

            <p className="page-subtitle">
              Consolidated daily recipe consumption planning.
            </p>
          </div>

          <div className="actions">
            <button
              type="button"
              onClick={() => navigate("/cooking/daily-plans")}
            >
              Back
            </button>
          </div>
        </div>

        {loading && <p>Loading daily consumption plan...</p>}

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        {!loading && !error && plan && (
          <>
            {/* Summary */}
            <div className="detail-summary-grid">
              <div className="detail-summary-item">
                <span className="detail-summary-label">Site</span>
                <span className="detail-summary-value">
                  {plan.branch_name || "-"}
                </span>
              </div>

              <div className="detail-summary-item">
                <span className="detail-summary-label">Used Date</span>
                <span className="detail-summary-value">
                  {formatDate(plan.used_date)}
                </span>
              </div>

              <div className="detail-summary-item">
                <span className="detail-summary-label">Status</span>
                <span className="detail-summary-value">
                  {plan.status || "-"}
                </span>
              </div>

              <div className="detail-summary-item">
                <span className="detail-summary-label">Created By</span>
                <span className="detail-summary-value">
                  {plan.created_by_name || "-"}
                </span>
              </div>

              <div className="detail-summary-item">
                <span className="detail-summary-label">Recipes</span>
                <span className="detail-summary-value">
                  {plan.recipes?.length || 0}
                </span>
              </div>

              <div className="detail-summary-item">
                <span className="detail-summary-label">Ingredients</span>
                <span className="detail-summary-value">
                  {plan.ingredient_summaries?.length || 0}
                </span>
              </div>
            </div>

            {plan.notes ? (
              <div className="detail-note-box">
                <b>Notes:</b> {plan.notes}
              </div>
            ) : null}

            {/* Recipes */}
            <div className="card pad stack-14" style={{ marginTop: 16 }}>
              <h3 style={{ marginTop: 0 }}>Recipe Consumptions</h3>

              <div className="desktop-only">
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Recipe</th>
                        <th>People</th>
                        <th>Protein</th>
                        <th>Status</th>
                        <th>Notes</th>
                      </tr>
                    </thead>

                    <tbody>
                      {(plan.recipes || []).map((recipeRow) => {
                        const detail = recipeRow.cook_batch_detail || {};

                        return (
                          <tr
                            key={recipeRow.id}
                            className="row-link"
                            onClick={() =>
                              navigate(
                                `/cooking/batches/${recipeRow.cook_batch}`,
                              )
                            }
                            title="Open recipe consumption detail"
                          >
                            <td>{recipeRow.recipe_name}</td>
                            <td>{detail.n_people || "-"}</td>
                            <td>{detail.protein_type || "-"}</td>
                            <td>{detail.status || "-"}</td>
                            <td>{detail.notes || "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mobile-only">
                <div className="batch-cards">
                  {(plan.recipes || []).map((recipeRow) => {
                    const detail = recipeRow.cook_batch_detail || {};

                    return (
                      <div
                        key={recipeRow.id}
                        className="batch-card"
                        onClick={() =>
                          navigate(`/cooking/batches/${recipeRow.cook_batch}`)
                        }
                        title="Open recipe consumption detail"
                      >
                        <div className="batch-card__title">
                          {recipeRow.recipe_name}
                        </div>

                        <div className="batch-card__meta">
                          <div>
                            <b>People:</b> {detail.n_people || "-"}
                          </div>

                          <div>
                            <b>Protein:</b> {detail.protein_type || "-"}
                          </div>

                          <div>
                            <b>Status:</b> {detail.status || "-"}
                          </div>
                        </div>

                        {detail.notes ? (
                          <div className="batch-card__notes">
                            {detail.notes}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Ingredient summary */}
            <div className="card pad stack-14" style={{ marginTop: 16 }}>
              <h3 style={{ marginTop: 0 }}>Consolidated Ingredient Summary</h3>

              <div className="desktop-only">
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 1200 }}>
                    <thead>
                      <tr>
                        <th>Ingredient</th>
                        <th>Group</th>
                        <th>Unit</th>
                        <th>Raw Total</th>
                        <th>Adjusted Total</th>
                        <th>Adjustment</th>
                        <th>Factor</th>
                        <th>Shared</th>
                      </tr>
                    </thead>

                    <tbody>
                      {(plan.ingredient_summaries || []).map((item) => (
                        <tr key={item.id}>
                          <td>{item.ingredient}</td>
                          <td>{item.group || "-"}</td>
                          <td>{getDisplayUnit(item.unit_display)}</td>

                          <td>
                            {formatIngredientValue(
                              item.raw_total_g,
                              item.unit_display,
                            )}
                          </td>

                          <td>
                            {formatIngredientValue(
                              item.adjusted_total_g,
                              item.unit_display,
                            )}
                          </td>

                          <td>
                            {formatIngredientValue(
                              item.adjustment_g,
                              item.unit_display,
                            )}
                          </td>

                          <td>{item.daily_factor}</td>

                          <td>{item.is_shared_adjusted ? "Yes" : "No"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mobile-only">
                <div className="batch-cards">
                  {(plan.ingredient_summaries || []).map((item) => (
                    <div key={item.id} className="batch-card">
                      <div className="batch-card__title">{item.ingredient}</div>

                      <div className="batch-card__meta">
                        <div>
                          <b>Group:</b> {item.group || "-"}
                        </div>

                        <div>
                          <b>Unit:</b> {getDisplayUnit(item.unit_display)}
                        </div>

                        <div>
                          <b>Raw:</b>{" "}
                          {formatIngredientValue(
                            item.raw_total_g,
                            item.unit_display,
                          )}
                        </div>

                        <div>
                          <b>Adjusted:</b>{" "}
                          {formatIngredientValue(
                            item.adjusted_total_g,
                            item.unit_display,
                          )}
                        </div>

                        <div>
                          <b>Factor:</b> {item.daily_factor}
                        </div>
                      </div>

                      {item.adjustment_reason ? (
                        <div className="batch-card__notes">
                          {item.adjustment_reason}
                        </div>
                      ) : null}
                    </div>
                  ))}
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

function getDisplayUnit(unit) {
  if (unit === "ml") return "L";
  if (unit === "pc") return "pc";
  return "kg";
}

function formatIngredientValue(valueG, unit) {
  if (valueG === null || valueG === undefined) return "-";

  const value = Number(valueG);

  if (!Number.isFinite(value)) return "-";

  if (unit === "ml") {
    return (value / 1000).toFixed(2);
  }

  if (unit === "pc") {
    return value.toFixed(0);
  }

  return (value / 1000).toFixed(2);
}

export default DailyConsumptionPlanDetailScreen;
