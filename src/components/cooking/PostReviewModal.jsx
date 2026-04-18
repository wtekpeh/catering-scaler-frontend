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

  useEffect(() => {
    if (!isOpen || !batch?.items) return;

    setPostReviewItems(
      batch.items.map((item) => ({
        id: item.id,
        ingredient: item.ingredient,
        group: item.group || "",
        actual_kg:
          item.actual_kg !== null && item.actual_kg !== undefined
            ? String(item.actual_kg)
            : item.final_kg !== null && item.final_kg !== undefined
              ? String(item.final_kg)
              : "",
        notes: item.notes || "",
      })),
    );

    setPostReviewNote(batch.notes || "");
  }, [isOpen, batch]);

  const hasItems = postReviewItems.length > 0;

  const preparedItems = useMemo(() => {
    return postReviewItems
      .map((item) => {
        const rawKg = String(item.actual_kg || "").trim();
        if (rawKg === "") return null;

        const kg = Number(rawKg);
        if (!Number.isFinite(kg) || kg < 0) return null;

        return {
          id: item.id,
          actual_g: Math.round(kg * 1000),
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
            <div className="post-review-modal__list">
              {postReviewItems.map((item) => {
                const rawKg = String(item.actual_kg || "").trim();
                const actualG =
                  rawKg !== "" && Number.isFinite(Number(rawKg))
                    ? String(Math.round(Number(rawKg) * 1000))
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
                        <label className="label">Actual (kg)</label>
                        <input
                          className="input"
                          type="number"
                          min="0"
                          step="0.001"
                          value={item.actual_kg}
                          disabled={loading}
                          onChange={(e) =>
                            handleActualKgChange(item.id, e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="label">Actual (g)</label>
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

export default PostReviewModal;
