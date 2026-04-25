import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  listCookBatches,
  recalibrateIngredients,
  getCurrentUser,
} from "../actions/cookBatchActions";

import ConfirmActionModal from "../components/common/ConfirmActionModal";

const CookBatchListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showRecalibrateConfirm, setShowRecalibrateConfirm] = useState(false);

  const userMe = useSelector((state) => state.userMe);
  const { user } = userMe;

  const canRecalibrate = user?.can_recalibrate;
  const canCreateBatch = user?.can_create_batch_any;

  const cookBatchList = useSelector((state) => state.cookBatchList);
  const { loading, error, batches } = cookBatchList;

  const recalibrateState = useSelector((state) => state.recalibrate);
  const {
    loading: recalLoading,
    success: recalSuccess,
    error: recalError,
  } = recalibrateState;

  useEffect(() => {
    dispatch(listCookBatches());
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (recalSuccess && !recalLoading) {
      setShowRecalibrateConfirm(false);
    }
  }, [recalSuccess, recalLoading]);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h2 className="page-title">Cook Batches</h2>

          <div className="actions">
            <button type="button" onClick={() => dispatch(listCookBatches())}>
              Refresh
            </button>

            {canRecalibrate && (
              <button
                type="button"
                className="btn warning"
                onClick={() => setShowRecalibrateConfirm(true)}
                disabled={recalLoading}
              >
                {recalLoading ? "Recalculating..." : "Recalculate"}
              </button>
            )}

            {canCreateBatch && (
              <button
                type="button"
                onClick={() => navigate("/cooking/batches/create")}
              >
                + Create Batch
              </button>
            )}
          </div>
        </div>

        {recalError && <p style={{ color: "crimson" }}>{recalError}</p>}
        {recalSuccess && !recalError && (
          <p style={{ color: "green" }}>Recalibration completed.</p>
        )}

        {loading && <p>Loading batches...</p>}
        {error && <p style={{ color: "crimson" }}>{error}</p>}

        {!loading && !error && (
          <>
            {!batches || batches.length === 0 ? (
              <div className="card pad" style={{ marginTop: 14 }}>
                <p style={{ marginTop: 0 }}>
                  No batches yet. Create your first prediction run.
                </p>
                {canCreateBatch && (
                  <button
                    type="button"
                    onClick={() => navigate("/cooking/batches/create")}
                  >
                    Create Batch
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
                          <th>People</th>
                          <th>Prepared By</th>
                          <th>Branch</th>
                          <th>Protein</th>
                          <th>Protein</th>
                          <th>Status</th>
                          <th>Notes</th>
                          <th>Created</th>
                        </tr>
                      </thead>

                      <tbody>
                        {batches.map((b) => (
                          <tr
                            key={b.id}
                            className="row-link"
                            onClick={() => navigate(`/cooking/batches/${b.id}`)}
                            title="Open batch detail"
                          >
                            <td>{b.id}</td>
                            <td>{b.recipe_name}</td>
                            <td>{b.n_people}</td>
                            <td>{b.created_by_name || "-"}</td>
                            <td>{b.branch_name || "-"}</td>
                            <td>{b.protein_type || "-"}</td>
                            <td>
                              <span
                                className={`badge ${
                                  (b.status || "").toLowerCase() === "final"
                                    ? "final"
                                    : (b.status || "").toLowerCase() === "draft"
                                      ? "draft"
                                      : "other"
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>

                            <td title={b.notes || ""}>
                              {truncate(b.notes || "-", 60)}
                            </td>
                            <td>{formatDateTime(b.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile cards (PASTE STARTS HERE) */}
                <div className="mobile-only" style={{ marginTop: 12 }}>
                  <div className="batch-cards">
                    {batches.map((b) => (
                      <div
                        key={b.id}
                        className="batch-card"
                        onClick={() => navigate(`/cooking/batches/${b.id}`)}
                        title="Open batch detail"
                      >
                        <div className="batch-card__top">
                          <div className="batch-card__title">Batch #{b.id}</div>

                          <span
                            className={`badge ${
                              (b.status || "").toLowerCase() === "final"
                                ? "final"
                                : (b.status || "").toLowerCase() === "draft"
                                  ? "draft"
                                  : "other"
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>

                        <div className="batch-card__meta">
                          <div>
                            <b>Recipe:</b> {b.recipe_name}
                          </div>
                          <div>
                            <b>People:</b> {b.n_people}
                          </div>
                          <div>
                            <b>Prepared by:</b> {b.created_by_name || "-"}
                          </div>
                          <div>
                            <b>Branch:</b> {b.branch_name || "-"}
                          </div>
                          <div>
                            <b>Protein:</b> {b.protein_type || "-"}
                          </div>
                          <div className="cell-sub">
                            {formatDateTime(b.created_at)}
                          </div>
                        </div>

                        {b.notes ? (
                          <div className="batch-card__notes">
                            {truncate(b.notes, 120)}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Mobile cards (PASTE ENDS HERE) */}
              </>
            )}
          </>
        )}
      </div>

      <ConfirmActionModal
        isOpen={showRecalibrateConfirm}
        title="Run Recalibration?"
        message="This will recalculate ingredient scale factors from historical cooking data. Only continue if you want to refresh the learning model."
        confirmLabel="Yes, Recalibrate"
        cancelLabel="Cancel"
        variant="warning"
        loading={recalLoading}
        onClose={() => setShowRecalibrateConfirm(false)}
        onConfirm={() => dispatch(recalibrateIngredients())}
      />
    </div>
  );
};

function formatDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function truncate(text, maxLen) {
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + "…";
}

export default CookBatchListScreen;
