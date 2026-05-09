import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  listDailyConsumptionPlans,
  getCurrentUser,
} from "../actions/cookBatchActions";

const DailyConsumptionPlanListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userMe = useSelector((state) => state.userMe);
  const { user } = userMe;

  const canCreateBatch = user?.can_create_batch_any;

  const dailyPlanList = useSelector((state) => state.dailyConsumptionPlanList);

  const { loading, error, plans = [] } = dailyPlanList || {};

  useEffect(() => {
    dispatch(listDailyConsumptionPlans());
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h2 className="page-title">Daily Consumption Plans</h2>

          <div className="actions">
            <button
              type="button"
              onClick={() => dispatch(listDailyConsumptionPlans())}
            >
              Refresh
            </button>

            {canCreateBatch && (
              <button
                type="button"
                onClick={() => navigate("/cooking/daily-plans/create")}
              >
                + Create Daily Plan
              </button>
            )}
          </div>
        </div>

        {loading && <p>Loading daily plans...</p>}
        {error && <p style={{ color: "crimson" }}>{error}</p>}

        {!loading && !error && (
          <>
            {!plans || plans.length === 0 ? (
              <div className="card pad" style={{ marginTop: 14 }}>
                <p style={{ marginTop: 0 }}>
                  No daily plans yet. Create your first daily consumption plan.
                </p>

                {canCreateBatch && (
                  <button
                    type="button"
                    onClick={() => navigate("/cooking/daily-plans/create")}
                  >
                    + Create Daily Plan
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="desktop-only">
                  <div className="table-wrap" style={{ marginTop: 12 }}>
                    <table className="table" style={{ minWidth: 900 }}>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Site</th>
                          <th>Used Date</th>
                          <th>Recipes</th>
                          <th>Ingredients</th>
                          <th>Status</th>
                          <th>Created By</th>
                          <th>Created</th>
                          <th>Notes</th>
                        </tr>
                      </thead>

                      <tbody>
                        {plans.map((plan) => (
                          <tr
                            key={plan.id}
                            className="row-link"
                            onClick={() =>
                              navigate(`/cooking/daily-plans/${plan.id}`)
                            }
                            title="Open daily plan detail"
                          >
                            <td>{plan.id}</td>
                            <td>{plan.branch_name || "-"}</td>
                            <td>{formatDate(plan.used_date)}</td>
                            <td>{plan.recipes?.length || 0}</td>
                            <td>{plan.ingredient_summaries?.length || 0}</td>
                            <td>
                              <span
                                className={`badge ${
                                  (plan.status || "").toLowerCase() === "final"
                                    ? "final"
                                    : (plan.status || "").toLowerCase() ===
                                        "draft"
                                      ? "draft"
                                      : "other"
                                }`}
                              >
                                {plan.status}
                              </span>
                            </td>
                            <td>{plan.created_by_name || "-"}</td>
                            <td>{formatDateTime(plan.created_at)}</td>
                            <td title={plan.notes || ""}>
                              {truncate(plan.notes || "-", 60)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile cards */}
                <div className="mobile-only" style={{ marginTop: 12 }}>
                  <div className="batch-cards">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        className="batch-card"
                        onClick={() =>
                          navigate(`/cooking/daily-plans/${plan.id}`)
                        }
                        title="Open daily plan detail"
                      >
                        <div className="batch-card__top">
                          <div className="batch-card__title">
                            Daily Plan #{plan.id}
                          </div>

                          <span
                            className={`badge ${
                              (plan.status || "").toLowerCase() === "final"
                                ? "final"
                                : (plan.status || "").toLowerCase() === "draft"
                                  ? "draft"
                                  : "other"
                            }`}
                          >
                            {plan.status}
                          </span>
                        </div>

                        <div className="batch-card__meta">
                          <div>
                            <b>Site:</b> {plan.branch_name || "-"}
                          </div>
                          <div>
                            <b>Used Date:</b> {formatDate(plan.used_date)}
                          </div>
                          <div>
                            <b>Recipes:</b> {plan.recipes?.length || 0}
                          </div>
                          <div>
                            <b>Ingredients:</b>{" "}
                            {plan.ingredient_summaries?.length || 0}
                          </div>
                          <div>
                            <b>Created by:</b> {plan.created_by_name || "-"}
                          </div>
                          <div className="cell-sub">
                            Created: {formatDateTime(plan.created_at)}
                          </div>
                        </div>

                        {plan.notes ? (
                          <div className="batch-card__notes">
                            {truncate(plan.notes, 120)}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

function formatDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

function truncate(text, maxLen) {
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + "…";
}

export default DailyConsumptionPlanListScreen;
