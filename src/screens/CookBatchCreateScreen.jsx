import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createCookBatch, listRecipes } from "../actions/cookBatchActions";
import { COOKBATCH_CREATE_RESET } from "../constants/cookBatchConstants";

const PROTEIN_CHOICES = ["BONES IN BEEF", "FISH", "FRESH CHICKEN"];

const CookBatchCreateScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ---- Local form state ----
  const [recipeId, setRecipeId] = useState("");
  const [nPeople, setNPeople] = useState(10);

  // Multiple proteins: [{ protein: "FISH", count: "50" }, ...]
  const [proteinRows, setProteinRows] = useState([]);
  const [notes, setNotes] = useState("");

  // ---- Redux state ----
  const cookBatchCreate = useSelector((state) => state.cookBatchCreate);
  const { loading, error, success, batch } = cookBatchCreate;

  const recipeList = useSelector((state) => state.recipeList);
  const { loading: recipesLoading, error: recipesError, recipes } = recipeList;

  useEffect(() => {
    if (success && batch?.id) {
      navigate(`/cooking/batches/${batch.id}`);
      dispatch({ type: COOKBATCH_CREATE_RESET });
    }
  }, [success, batch, navigate, dispatch]);

  useEffect(() => {
    dispatch(listRecipes());
  }, [dispatch]);

  const totalProteinCount = useMemo(() => {
    return proteinRows.reduce((sum, r) => {
      const n = Number((r.count || "").trim());
      return Number.isFinite(n) ? sum + n : sum;
    }, 0);
  }, [proteinRows]);

  const hasAnyProteinSelected = useMemo(
    () => proteinRows.some((r) => (r.protein || "").trim() !== ""),
    [proteinRows]
  );

  const canAutoFillSingleProtein = useMemo(() => {
    const selected = proteinRows.filter((r) => (r.protein || "").trim() !== "");
    return selected.length === 1;
  }, [proteinRows]);

  const addProteinRow = () => {
    setProteinRows((prev) => [...prev, { protein: "", count: "" }]);
  };

  const removeProteinRow = (idx) => {
    setProteinRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateProteinRow = (idx, patch) => {
    setProteinRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, ...patch } : r))
    );
  };

  const clearForm = () => {
    setRecipeId("");
    setNPeople(10);
    setProteinRows([]);
    setNotes("");
  };

  const validateProteins = () => {
    const N = Number(nPeople);

    if (!hasAnyProteinSelected) {
      // protein is optional: allow none
      return { ok: true, normalized: [] };
    }

    // normalize rows that have a protein selected
    const selected = proteinRows
      .filter((r) => (r.protein || "").trim() !== "")
      .map((r) => ({
        protein: r.protein.trim(),
        count: (r.count || "").trim(),
      }));

    // prevent duplicates
    const set = new Set();
    for (const s of selected) {
      const key = s.protein.toUpperCase();
      if (set.has(key)) {
        return { ok: false, msg: `Duplicate protein selected: ${s.protein}` };
      }
      set.add(key);
    }

    if (selected.length === 1) {
      // single protein: auto-assign full N, ignore any typed count
      return {
        ok: true,
        normalized: [{ protein: selected[0].protein, count: N }],
      };
    }

    // multiple proteins: each must have a valid count; total must equal N
    let sum = 0;
    for (const s of selected) {
      const n = Number(s.count);
      if (!Number.isFinite(n) || n <= 0) {
        return {
          ok: false,
          msg: `Enter a valid count for "${s.protein}" (must be > 0).`,
        };
      }
      sum += n;
    }

    if (sum !== N) {
      return {
        ok: false,
        msg: `Protein counts must sum to ${N}. Current sum is ${sum}.`,
      };
    }

    return {
      ok: true,
      normalized: selected.map((s) => ({
        protein: s.protein,
        count: Number(s.count),
      })),
    };
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!recipeId) {
      alert("Please enter/select a recipe_id.");
      return;
    }

    const N = Number(nPeople);
    if (!N || N <= 0) {
      alert("Please enter a valid number of people.");
      return;
    }

    const v = validateProteins();
    if (!v.ok) {
      alert(v.msg);
      return;
    }

    // Build options payload:
    // - Backward compatible (single): options.protein = "<name>"
    // - New: options.proteins = [{ protein, n_people }]
    const options = {};

    if (v.normalized.length === 1) {
      options.protein = v.normalized[0].protein; // keeps your current backend working
      options.proteins = [
        { protein: v.normalized[0].protein, n_people: v.normalized[0].count },
      ];
    } else if (v.normalized.length > 1) {
      options.proteins = v.normalized.map((p) => ({
        protein: p.protein,
        n_people: p.count,
      }));
      // NOTE: backend must be updated to support this multi-protein mode
    }

    dispatch(
      createCookBatch({
        recipe_id: Number(recipeId),
        n_people: N,
        options,
        notes,
      })
    );
  };

  return (
    <div style={{ padding: 16, maxWidth: 760 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button type="button" onClick={() => navigate("/cooking/batches")}>
          ← Back to List
        </button>
        <h2 style={{ margin: 0 }}>Create Cook Batch</h2>
      </div>

      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Protein can be split. If you select <b>one</b> protein, it automatically
        uses the full number of people. If you select <b>multiple</b>, their
        counts must sum to the total.
      </p>

      {loading && <p>Creating batch...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <form onSubmit={submitHandler} style={{ marginTop: 14 }}>
        {/* recipe */}
        <div style={fieldWrap}>
          <label style={label}>Recipe</label>

          {recipesLoading ? (
            <div style={hint}>Loading recipes...</div>
          ) : recipesError ? (
            <div style={{ ...hint, color: "crimson" }}>{recipesError}</div>
          ) : (
            <select
              value={recipeId}
              onChange={(e) => setRecipeId(e.target.value)}
              style={input}
            >
              <option value="">-- Select recipe --</option>
              {(recipes || []).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* n_people */}
        <div style={fieldWrap}>
          <label style={label}>Number of People</label>
          <input
            type="number"
            min="1"
            value={nPeople}
            onChange={(e) => setNPeople(e.target.value)}
            style={input}
          />
        </div>

        {/* protein split */}
        <div style={fieldWrap}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <label style={{ ...label, marginBottom: 0 }}>
              Protein split (optional)
            </label>
            <button type="button" onClick={addProteinRow} disabled={loading}>
              + Add Protein
            </button>
          </div>

          {proteinRows.length === 0 ? (
            <div style={hint}>
              No protein selected (optional). Click “Add Protein” if needed.
            </div>
          ) : (
            <>
              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                {proteinRows.map((row, idx) => {
                  const selectedCount = proteinRows.filter(
                    (r) => (r.protein || "").trim() !== ""
                  ).length;
                  const isMulti = selectedCount > 1;
                  const disableCount = !isMulti && canAutoFillSingleProtein; // single selected -> auto full N

                  return (
                    <div
                      key={idx}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 160px 90px",
                        gap: 10,
                        alignItems: "center",
                      }}
                    >
                      <select
                        value={row.protein}
                        onChange={(e) =>
                          updateProteinRow(idx, { protein: e.target.value })
                        }
                        style={input}
                      >
                        <option value="">-- Select protein --</option>
                        {PROTEIN_CHOICES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={row.count}
                        onChange={(e) =>
                          updateProteinRow(idx, { count: e.target.value })
                        }
                        style={input}
                        disabled={disableCount}
                        placeholder={
                          disableCount ? `auto = ${nPeople}` : "e.g. 50"
                        }
                        title={
                          disableCount
                            ? "Single protein auto-fills to total people"
                            : "Enter people count for this protein"
                        }
                      />

                      <button
                        type="button"
                        onClick={() => removeProteinRow(idx)}
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* summary */}
              <div style={{ marginTop: 10, fontSize: 12, opacity: 0.8 }}>
                <div>
                  Total people: <b>{Number(nPeople) || 0}</b>
                </div>

                {(() => {
                  const selectedCount = proteinRows.filter(
                    (r) => (r.protein || "").trim() !== ""
                  ).length;
                  if (selectedCount === 0) return <div>Protein: none</div>;
                  if (selectedCount === 1)
                    return (
                      <div>
                        Protein: single selection (auto uses full total)
                      </div>
                    );
                  return (
                    <div>
                      Protein split sum: <b>{totalProteinCount}</b> (must equal
                      total)
                    </div>
                  );
                })()}
              </div>
            </>
          )}
        </div>

        {/* notes */}
        <div style={fieldWrap}>
          <label style={label}>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any notes for this cook batch..."
            rows={4}
            style={{ ...input, resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button type="submit" disabled={loading}>
            Create Batch
          </button>

          <button type="button" onClick={clearForm} disabled={loading}>
            Clear
          </button>
        </div>

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
          Backend note: single-protein mode uses <code>options.protein</code>.
          Multi-protein mode sends <code>options.proteins</code> and needs
          backend support.
        </div>
      </form>
    </div>
  );
};

const fieldWrap = {
  marginBottom: 14,
  padding: 12,
  border: "1px solid #eee",
  borderRadius: 10,
};

const label = {
  display: "block",
  fontWeight: 600,
  marginBottom: 6,
};

const input = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #ccc",
  outline: "none",
};

const hint = {
  marginTop: 8,
  fontSize: 12,
  opacity: 0.75,
};

export default CookBatchCreateScreen;
