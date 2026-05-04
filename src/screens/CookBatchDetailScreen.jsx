import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  getCookBatchDetail,
  updateCookBatchActuals,
  postReviewUpdateCookBatch,
  getCurrentUser,
} from "../actions/cookBatchActions";

import { useExecutiveDashboardStore } from "../stores/dashboard/useExecutiveDashboardStore";

import PostReviewModal from "../components/cooking/PostReviewModal";
import ConfirmActionModal from "../components/common/ConfirmActionModal";

import {
  COOKBATCH_ACTUALS_UPDATE_RESET,
  COOKBATCH_POST_REVIEW_RESET,
} from "../constants/cookBatchConstants";

const CookBatchDetailScreen = () => {
  const { id } = useParams();
  const batchId = Number(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cookBatchDetail = useSelector((state) => state.cookBatchDetail);
  const { loading, error, batch } = cookBatchDetail;

  const userMe = useSelector((state) => state.userMe);
  const { user } = userMe;

  const cookBatchActualsUpdate = useSelector(
    (state) => state.cookBatchActualsUpdate,
  );
  const {
    loading: updating,
    error: updateError,
    success: updateSuccess,
    updatedBatch,
  } = cookBatchActualsUpdate;

  const cookBatchPostReview = useSelector((state) => state.cookBatchPostReview);
  const {
    loading: postReviewLoading,
    error: postReviewError,
    success: postReviewSuccess,
  } = cookBatchPostReview;

  const {
    exportingBatchDetailExcel,
    exportBatchDetailExcel,
    exportingBatchDetailPDF,
    exportBatchDetailPDF,
  } = useExecutiveDashboardStore();

  // Local edit map: { [itemId]: { actual_kg: string, notes: string } }
  const [actualEdits, setActualEdits] = useState({});

  const [showPostReviewModal, setShowPostReviewModal] = useState(false);

  const [showPostReviewConfirm, setShowPostReviewConfirm] = useState(false);

  const [hideZeroItems, setHideZeroItems] = useState(true);

  // Load batch detail
  useEffect(() => {
    if (!Number.isFinite(batchId)) return;

    dispatch(getCurrentUser());
    dispatch(getCookBatchDetail(batchId));
  }, [dispatch, batchId]);

  // Seed inputs from server actual_kg (preferred for UI)
  useEffect(() => {
    if (!batch?.items) return;

    const seed = {};
    batch.items.forEach((it) => {
      seed[it.id] = {
        actual_kg:
          it.actual_kg !== null && it.actual_kg !== undefined
            ? formatDisplayKg(it.actual_kg, getDisplayConfig(it.ingredient))
            : "",
        notes: it.notes || "",
      };
    });
    setActualEdits(seed);
  }, [batch?.items]);

  // After successful PATCH, refresh detail once
  useEffect(() => {
    if (updateSuccess && updatedBatch) {
      dispatch(getCookBatchDetail(batchId));
      dispatch({ type: COOKBATCH_ACTUALS_UPDATE_RESET });
    }
  }, [updateSuccess, updatedBatch, dispatch, batchId]);

  useEffect(() => {
    if (postReviewSuccess) {
      dispatch(getCookBatchDetail(batchId));
      dispatch({ type: COOKBATCH_POST_REVIEW_RESET });
      setShowPostReviewModal(false);
      setShowPostReviewConfirm(false);
    }
  }, [postReviewSuccess, dispatch, batchId]);

  const isFinal = (batch?.status || "").toLowerCase() === "final";
  const isGlobalUser = Boolean(user?.can_recalibrate);
  const isRecipeActualsLocked =
    Boolean(batch?.recipe_actuals_locked) && !isGlobalUser;
  const canCreateBatch = user?.can_create_batch_any;
  const canUpdateBatch = user?.can_update_batch;
  const canPostReview = Boolean(user?.can_post_review || user?.can_recalibrate);

  const items = batch?.items || [];

  const visibleItems = hideZeroItems
    ? items.filter((it) => !isZeroIngredientRow(it))
    : items;

  function isZeroIngredientRow(it) {
    const finalKg = Number(it.final_kg || 0);
    const predKg = Number(it.pred_kg || 0);
    const actualKg = Number(it.actual_kg || 0);

    return finalKg === 0 && predKg === 0 && actualKg === 0;
  }

  // Build PATCH payload using grams (backend expects actual_g)
  const patchItemsPayload = useMemo(() => {
    const out = [];

    items.forEach((it) => {
      const edit = actualEdits[it.id];
      if (!edit) return;

      const rawKg = (edit.actual_kg || "").trim();
      if (rawKg === "") return;

      const displayValue = Number(rawKg);
      if (!Number.isFinite(displayValue) || displayValue < 0) return;

      const config = getDisplayConfig(it.ingredient);
      const actual_g = config.displayToActualG(displayValue);

      out.push({
        id: it.id,
        actual_g,
        notes: edit.notes || "",
      });
    });

    return out;
  }, [items, actualEdits]);

  // When finalizing: fill blanks using final_kg (reduce user workload)
  const finalizeItemsPayload = useMemo(() => {
    const out = [];

    items.forEach((it) => {
      const edit = actualEdits[it.id];
      const rawKg = (edit?.actual_kg || "").trim();

      let actual_g;

      // If user typed actual_kg, use it
      if (
        rawKg !== "" &&
        Number.isFinite(Number(rawKg)) &&
        Number(rawKg) >= 0
      ) {
        const config = getDisplayConfig(it.ingredient);
        actual_g = config.displayToActualG(Number(rawKg));
      } else {
        // Otherwise assume final was used
        // Prefer final_g if your API returns it, else compute from final_kg
        if (it.final_g !== null && it.final_g !== undefined) {
          actual_g = Number(it.final_g);
        } else if (it.final_kg !== null && it.final_kg !== undefined) {
          actual_g = Math.round(Number(it.final_kg) * 1000);
        } else {
          // last fallback (shouldn't happen)
          actual_g = 0;
        }
      }

      out.push({
        id: it.id,
        actual_g,
        notes: edit?.notes || "",
      });
    });

    return out;
  }, [items, actualEdits]);

  const onChangeActualKg = (itemId, value) => {
    setActualEdits((prev) => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        actual_kg: value,
      },
    }));
  };

  const onChangeNotes = (itemId, value) => {
    setActualEdits((prev) => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        notes: value,
      },
    }));
  };

  const submitActuals = (finalize = false) => {
    if (!batchId) return;

    if (!canUpdateBatch) {
      alert("You do not have permission to update this batch.");
      return;
    }

    if (isFinal) {
      alert("This batch is already final.");
      return;
    }

    if (!finalize && patchItemsPayload.length === 0) {
      alert("No actual values to submit yet.");
      return;
    }

    const itemsToSend = finalize ? finalizeItemsPayload : patchItemsPayload;

    dispatch(
      updateCookBatchActuals(batchId, {
        items: itemsToSend,
        finalize,
      }),
    );
  };

  const submitPostReview = (payload) => {
    if (!batchId) return;

    if (!canPostReview) {
      window.alert("You do not have permission to perform post-review edits.");
      return;
    }

    dispatch(postReviewUpdateCookBatch(batchId, payload));
  };

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="actions detail-header-actions">
            <button
              className="btn ghost"
              type="button"
              onClick={() => navigate("/cooking/batches")}
            >
              ← Back to List
            </button>

            {canCreateBatch && (
              <button
                className="btn ghost"
                type="button"
                onClick={() => navigate("/cooking/batches/create")}
              >
                + New Consumption
              </button>
            )}
          </div>

          <h2 className="page-title">
            Consumption #{batchId}{" "}
            {batch?.recipe_name ? `— ${batch.recipe_name}` : ""}
          </h2>

          {batch?.status && <StatusPill status={batch.status} />}
        </div>

        {loading && <p className="helper">Loading batch...</p>}
        {error && <p style={{ color: "crimson" }}>{error}</p>}

        {!loading && !error && batch && (
          <>
            {/* Batch summary */}
            <div className="card pad" style={{ marginBottom: 12 }}>
              <div>
                <b>People:</b> {batch.n_people}
              </div>
              <div>
                <b>Used Date:</b> {formatDate(batch.used_date)}
              </div>
              <div>
                <b>Protein:</b> {batch.protein_type || "-"}
              </div>
              <div>
                <b>Created:</b> {formatDateTime(batch.created_at)}
              </div>
              {batch.notes ? (
                <div style={{ marginTop: 6 }}>
                  <b>Notes:</b> {batch.notes}
                </div>
              ) : null}
            </div>

            {/* Update status */}
            {updating && <p className="helper">Saving...</p>}
            {updateError && <p style={{ color: "crimson" }}>{updateError}</p>}

            {/* Actions */}
            <div className="actions detail-actions">
              <button
                className="btn"
                type="button"
                onClick={() => dispatch(getCookBatchDetail(batchId))}
              >
                Refresh
              </button>

              <button
                className="btn"
                type="button"
                disabled={exportingBatchDetailExcel}
                onClick={() => exportBatchDetailExcel(batchId)}
              >
                {exportingBatchDetailExcel ? "Exporting..." : "Export Excel"}
              </button>

              <button
                className="btn"
                type="button"
                disabled={exportingBatchDetailPDF}
                onClick={() => exportBatchDetailPDF(batchId)}
              >
                {exportingBatchDetailPDF ? "Exporting..." : "Export PDF"}
              </button>

              {canUpdateBatch && !isFinal && !isRecipeActualsLocked && (
                <button
                  className="btn primary"
                  type="button"
                  disabled={updating}
                  onClick={() => submitActuals(false)}
                >
                  Save Actuals
                </button>
              )}

              {canUpdateBatch && !isFinal && (
                <button
                  className="btn"
                  type="button"
                  disabled={updating}
                  onClick={() => {
                    const ok = window.confirm(
                      "Finalize this batch? You won’t be able to edit actuals after.",
                    );
                    if (ok) submitActuals(true);
                  }}
                >
                  Finalize Batch
                </button>
              )}

              {isFinal && canPostReview && (
                <button
                  className="btn warning"
                  type="button"
                  disabled={postReviewLoading}
                  onClick={() => setShowPostReviewConfirm(true)}
                >
                  Post Review Edit
                </button>
              )}
            </div>

            {isFinal && (
              <p className="helper">
                This batch is <b>final</b>. Actual values are locked.
                {!canPostReview
                  ? " Post-review edits are restricted to privileged users."
                  : ""}
              </p>
            )}

            {!isFinal && !canUpdateBatch && (
              <p className="helper">You have view-only access to this batch.</p>
            )}

            <div style={{ marginBottom: 10 }}>
              <label
                className="label"
                style={{ display: "flex", gap: 8, alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  checked={hideZeroItems}
                  onChange={(e) => setHideZeroItems(e.target.checked)}
                />
                Hide zero ingredients
              </label>
            </div>

            {/* DESKTOP TABLE */}
            <div className="desktop-only">
              <div className="table-wrap">
                <table className="table table--detail">
                  <thead>
                    <tr>
                      <th>Ingredient</th>
                      <th>Final</th>
                      <th>Pred</th>
                      <th>Clamped?</th>
                      <th>Actual</th>
                      <th>Converted</th>
                      <th>Notes</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleItems.map((it) => {
                      const edit = actualEdits[it.id] || {
                        actual_kg: "",
                        notes: "",
                      };

                      const config = getDisplayConfig(it.ingredient);

                      const rawKg = (edit.actual_kg || "").trim();
                      const actualG =
                        rawKg !== "" && Number.isFinite(Number(rawKg))
                          ? String(config.displayToActualG(Number(rawKg)))
                          : "";

                      return (
                        <tr key={it.id}>
                          <td>
                            <div className="cell-title">{it.ingredient}</div>
                            <div className="cell-sub">{it.group}</div>
                          </td>

                          <td>
                            {formatDisplayKg(it.final_kg, config)} {config.unit}
                          </td>
                          <td>
                            {formatDisplayKg(it.pred_kg, config)} {config.unit}
                          </td>

                          <td>
                            {it.was_clamped ? (
                              <span className="clamp-badge yes">Yes</span>
                            ) : (
                              <span className="clamp-badge no">No</span>
                            )}
                          </td>

                          <td>
                            <input
                              className="input"
                              type="number"
                              min="0"
                              step={config.inputStep}
                              value={edit.actual_kg}
                              disabled={
                                !canUpdateBatch ||
                                isFinal ||
                                isRecipeActualsLocked ||
                                updating
                              }
                              onChange={(e) =>
                                onChangeActualKg(it.id, e.target.value)
                              }
                            />
                          </td>

                          <td>
                            <input
                              className="input"
                              type="text"
                              value={
                                actualG
                                  ? `${actualG} ${config.backendPreviewUnit}`
                                  : ""
                              }
                              disabled
                            />
                          </td>

                          <td>
                            <input
                              className="input"
                              type="text"
                              value={edit.notes}
                              disabled={
                                !canUpdateBatch ||
                                isFinal ||
                                isRecipeActualsLocked ||
                                updating
                              }
                              onChange={(e) =>
                                onChangeNotes(it.id, e.target.value)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE CARDS */}
            <div className="mobile-only">
              <div className="batch-cards">
                {visibleItems.map((it) => {
                  const edit = actualEdits[it.id] || {
                    actual_kg: "",
                    notes: "",
                  };
                  const config = getDisplayConfig(it.ingredient);

                  const rawKg = (edit.actual_kg || "").trim();
                  const actualG =
                    rawKg !== "" && Number.isFinite(Number(rawKg))
                      ? String(config.displayToActualG(Number(rawKg)))
                      : "";

                  return (
                    <div key={it.id} className="batch-card">
                      <div className="batch-card__top">
                        <div className="batch-card__title">{it.ingredient}</div>

                        {it.was_clamped ? (
                          <span className="clamp-badge yes">Clamped</span>
                        ) : (
                          <span className="clamp-badge no">OK</span>
                        )}
                      </div>

                      <div className="batch-card__meta">
                        <div>
                          <b>Group:</b> {it.group}
                        </div>
                        <div>
                          <b>Final:</b> {formatDisplayKg(it.final_kg, config)}{" "}
                          {config.unit}
                        </div>
                        <div>
                          <b>Pred:</b> {formatDisplayKg(it.pred_kg, config)}{" "}
                          {config.unit}
                        </div>
                      </div>

                      <div className="stack-14">
                        <div>
                          <label className="label">{config.actualLabel}</label>
                          <input
                            className="input"
                            type="number"
                            min="0"
                            step={config.inputStep}
                            value={edit.actual_kg}
                            disabled={
                              !canUpdateBatch ||
                              isFinal ||
                              isRecipeActualsLocked ||
                              updating
                            }
                            onChange={(e) =>
                              onChangeActualKg(it.id, e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <label className="label">
                            {config.backendPreviewLabel}
                          </label>
                          <input
                            className="input"
                            type="text"
                            value={
                              actualG
                                ? `${actualG} ${config.backendPreviewUnit}`
                                : ""
                            }
                            disabled
                          />
                        </div>

                        <div>
                          <label className="label">Notes</label>
                          <input
                            className="input"
                            type="text"
                            value={edit.notes}
                            disabled={
                              !canUpdateBatch ||
                              isFinal ||
                              isRecipeActualsLocked ||
                              updating
                            }
                            onChange={(e) =>
                              onChangeNotes(it.id, e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
              Note: Oil displays in <b>L</b>, GA Kenkey displays in <b>pcs</b>,
              and other ingredients display in <b>kg</b>. Backend still receives
              grams. “Finalize Batch” fills blanks using the final backend
              quantity.
            </div>
          </>
        )}
      </div>

      <ConfirmActionModal
        isOpen={showPostReviewConfirm}
        title="Open Post Review Edit?"
        message="This action is restricted to privileged users and is meant for finalized batch corrections after review. Do you want to continue?"
        confirmLabel="Yes, Continue"
        cancelLabel="Cancel"
        variant="warning"
        loading={postReviewLoading}
        onClose={() => {
          if (!postReviewLoading) {
            setShowPostReviewConfirm(false);
          }
        }}
        onConfirm={() => {
          setShowPostReviewConfirm(false);
          setShowPostReviewModal(true);
        }}
      />

      <PostReviewModal
        isOpen={showPostReviewModal}
        onClose={() => {
          if (!postReviewLoading) {
            setShowPostReviewModal(false);
            dispatch({ type: COOKBATCH_POST_REVIEW_RESET });
          }
        }}
        onSubmit={submitPostReview}
        batch={batch}
        loading={postReviewLoading}
        error={postReviewError}
      />
    </div>
  );
};

function getDisplayConfig(ingredientName = "") {
  const name = ingredientName.toUpperCase();

  if (name.includes("GA KENKEY")) {
    return {
      unit: "pcs",
      actualLabel: "Actual (pcs)",
      backendPreviewLabel: "Actual (pcs)",
      backendPreviewUnit: "ml",
      finalLabel: "Final (pcs)",
      predLabel: "Pred (pcs)",
      inputStep: "1",
      kgToDisplay: (kg) => Number(kg) * 1000,
      displayToActualG: (value) => Math.round(Number(value)),
    };
  }

  if (name.includes("COOKING OIL")) {
    return {
      unit: "L",
      actualLabel: "Actual (L)",
      backendPreviewLabel: "Actual (ml)",
      backendPreviewUnit: "ml",
      finalLabel: "Final (L)",
      predLabel: "Pred (L)",
      inputStep: "0.001",
      kgToDisplay: (kg) => Number(kg),
      displayToActualG: (value) => Math.round(Number(value) * 1000),
    };
  }

  return {
    unit: "kg",
    actualLabel: "Actual (kg)",
    backendPreviewLabel: "Actual (g)",
    backendPreviewUnit: "g",
    finalLabel: "Final (kg)",
    predLabel: "Pred (kg)",
    inputStep: "0.001",
    kgToDisplay: (kg) => Number(kg),
    displayToActualG: (value) => Math.round(Number(value) * 1000),
  };
}

function formatDisplayKg(value, config, decimals = 3) {
  if (value === null || value === undefined) return "-";
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";

  const converted = config.kgToDisplay(n);

  if (config.unit === "pcs") {
    return String(Math.round(converted));
  }

  return converted.toFixed(decimals);
}

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

function formatDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

const StatusPill = ({ status }) => {
  const s = (status || "").toLowerCase();

  const bg = s === "final" ? "#e8f7ee" : s === "draft" ? "#eef2ff" : "#f6f6f6";

  const border =
    s === "final"
      ? "1px solid #a7e2bf"
      : s === "draft"
        ? "1px solid #c7d2fe"
        : "1px solid #ddd";

  const color = s === "final" ? "#0f7a3d" : s === "draft" ? "#3730a3" : "#333";

  return (
    <span
      className={`badge ${
        s === "final" ? "final" : s === "draft" ? "draft" : "other"
      }`}
      style={{ marginLeft: "auto" }}
    >
      {status}
    </span>
  );
};

export default CookBatchDetailScreen;
