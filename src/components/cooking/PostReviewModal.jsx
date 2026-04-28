import { useEffect, useMemo, useState } from "react";

const PostReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  batch,
  loading = false,
  error = "",
}) => {
  const [postReviewItems, setPostReviewItems] = useState([]);
  const [postReviewNote, setPostReviewNote] = useState("");
  const [hideZeroItems, setHideZeroItems] = useState(true);

  useEffect(() => {
    if (!isOpen || !batch?.items) return;

    setPostReviewItems(
      batch.items.map((item) => ({
        id: item.id,
        ingredient: item.ingredient,
        group: item.group || "",
        actual_kg:
          item.actual_kg !== null && item.actual_kg !== undefined
            ? formatDisplayKg(item.actual_kg, getDisplayConfig(item.ingredient))
            : item.final_kg !== null && item.final_kg !== undefined
              ? formatDisplayKg(
                  item.final_kg,
                  getDisplayConfig(item.ingredient),
                )
              : "",
        final_kg: item.final_kg,
        pred_kg: item.pred_kg,
        notes: item.notes || "",
      })),
    );

    setPostReviewNote(batch.notes || "");
  }, [isOpen, batch]);

  const hasItems = postReviewItems.length > 0;

  const visibleItems = hideZeroItems
    ? postReviewItems.filter((item) => !isZeroIngredientRow(item))
    : postReviewItems;

  const preparedItems = useMemo(() => {
    return postReviewItems
      .map((item) => {
        const rawKg = String(item.actual_kg || "").trim();
        if (rawKg === "") return null;

        const displayValue = Number(rawKg);
        if (!Number.isFinite(displayValue) || displayValue < 0) return null;

        const config = getDisplayConfig(item.ingredient);

        return {
          id: item.id,
          actual_g: config.displayToActualG(displayValue),
          notes: item.notes || "",
        };
      })
      .filter(Boolean);
  }, [postReviewItems]);

  const handleActualKgChange = (itemId, value) => {
    setPostReviewItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, actual_kg: value } : item,
      ),
    );
  };

  const handleNotesChange = (itemId, value) => {
    setPostReviewItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, notes: value } : item,
      ),
    );
  };

  const handleSubmit = () => {
    if (!preparedItems.length) {
      window.alert("Please enter at least one valid actual value.");
      return;
    }

    onSubmit({
      items: preparedItems,
      notes: postReviewNote,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="post-review-modal__backdrop" onClick={onClose}>
      <div
        className="post-review-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-review-modal-title"
      >
        <div className="post-review-modal__header">
          <div>
            <h3
              id="post-review-modal-title"
              className="post-review-modal__title"
            >
              Post Review Update
            </h3>
            <p className="post-review-modal__subtitle">
              Finalized batch corrections for Batch #{batch?.id}
            </p>
          </div>

          <button
            type="button"
            className="btn ghost"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>
        </div>

        {error ? <div className="post-review-modal__error">{error}</div> : null}

        {!hasItems ? (
          <p className="helper">No batch items available.</p>
        ) : (
          <>
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

            <div className="post-review-modal__list">
              {visibleItems.map((item) => {
                const rawKg = String(item.actual_kg || "").trim();
                const config = getDisplayConfig(item.ingredient);
                const actualG =
                  rawKg !== "" && Number.isFinite(Number(rawKg))
                    ? String(config.displayToActualG(Number(rawKg)))
                    : "";

                return (
                  <div key={item.id} className="post-review-modal__card">
                    <div className="post-review-modal__card-top">
                      <div>
                        <div className="post-review-modal__ingredient">
                          {item.ingredient}
                        </div>
                        <div className="post-review-modal__group">
                          {item.group || "-"}
                        </div>
                      </div>
                    </div>

                    <div className="post-review-modal__grid">
                      <div>
                        <label className="label">{config.actualLabel}</label>
                        <input
                          className="input"
                          type="number"
                          min="0"
                          step={config.inputStep}
                          value={item.actual_kg}
                          disabled={loading}
                          onChange={(e) =>
                            handleActualKgChange(item.id, e.target.value)
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
                          value={actualG}
                          disabled
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">Item Note</label>
                      <input
                        className="input"
                        type="text"
                        value={item.notes}
                        disabled={loading}
                        onChange={(e) =>
                          handleNotesChange(item.id, e.target.value)
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="post-review-modal__footer">
              <div>
                <label className="label">Batch-level Note</label>
                <textarea
                  className="input post-review-modal__textarea"
                  rows="3"
                  value={postReviewNote}
                  disabled={loading}
                  onChange={(e) => setPostReviewNote(e.target.value)}
                />
              </div>

              <div className="post-review-modal__actions">
                <button
                  type="button"
                  className="btn ghost"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Submit Post Review"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
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
      backendPreviewUnit: "pcs",
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
    inputStep: "0.001",
    kgToDisplay: (kg) => Number(kg),
    displayToActualG: (value) => Math.round(Number(value) * 1000),
  };
}

function formatDisplayKg(value, config, decimals = 3) {
  if (value === null || value === undefined) return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return "";

  const converted = config.kgToDisplay(n);

  if (config.unit === "pcs") {
    return String(Math.round(converted));
  }

  return converted.toFixed(decimals);
}

function isZeroIngredientRow(item) {
  const finalKg = Number(item.final_kg || 0);
  const predKg = Number(item.pred_kg || 0);
  const actualKg = Number(item.actual_kg || 0);

  return finalKg === 0 && predKg === 0 && actualKg === 0;
}

export default PostReviewModal;
