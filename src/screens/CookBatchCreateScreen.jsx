import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createCookBatch, listRecipes } from "../actions/cookBatchActions";
import { COOKBATCH_CREATE_RESET } from "../constants/cookBatchConstants";

const PROTEIN_CHOICES = [
  "BONES IN BEEF",
  "FISH",
  "FRESH CHICKEN",
  "GRILLED TILAPIA",
  "FRIED FISH",
  "SARDINE AND EGG",
];

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
    <div className="page">
      <div className="container container-sm">
        <div className="page-header">
          <h2 className="page-title">Create Cook Batch</h2>

          <div className="actions">
            <button
              type="button"
              className="btn ghost"
              onClick={() => navigate("/cooking/batches")}
            >
              ← Back to List
            </button>
          </div>
        </div>

        <p className="lead">
          Protein can be split. If you select <b>one</b> protein, it
          automatically uses the full number of people. If you select{" "}
          <b>multiple</b>, their counts must sum to the total.
        </p>

        {loading && <p>Creating batch...</p>}
        {error && <p className="text-danger">{error}</p>}

        <div className="card pad stack-14">
          <form onSubmit={submitHandler}>
            {/* recipe */}
            <div className="field">
              <label className="label">Recipe</label>
              <select
                className="select"
                value={recipeId}
                onChange={(e) => setRecipeId(e.target.value)}
              >
                <option value="">-- Select a recipe --</option>
                {recipes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* n_people */}
            <div className="field">
              <label className="label">Number of People</label>
              <input
                className="input"
                type="number"
                min="1"
                value={nPeople}
                onChange={(e) => setNPeople(e.target.value)}
                placeholder="e.g. 50"
              />
            </div>

            {/* protein split */}
            <div className="card pad stack-14">
              <div className="actions actions-tight">
                <label className="label label-inline">
                  Protein split (optional)
                </label>

                <button
                  type="button"
                  className="btn"
                  onClick={addProteinRow}
                  disabled={loading}
                >
                  + Add Protein
                </button>
              </div>

              {proteinRows.length === 0 ? (
                <p className="helper">
                  No protein selected (optional). Click “Add Protein” if needed.
                </p>
              ) : (
                <>
                  <div className="protein-rows">
                    {proteinRows.map((row, idx) => {
                      const selectedCount = proteinRows.filter(
                        (r) => (r.protein || "").trim() !== ""
                      ).length;

                      // Split mode should activate as soon as the user adds another row
                      const isSplitMode = proteinRows.length >= 2;

                      // Auto mode ONLY when exactly one row exists and it has a selected protein
                      const isSingleAutoMode =
                        proteinRows.length === 1 &&
                        selectedCount === 1 &&
                        (row.protein || "").trim() !== "";

                      const disableCount = isSingleAutoMode;

                      return (
                        <div key={idx} className="protein-row">
                          <select
                            value={row.protein}
                            onChange={(e) =>
                              updateProteinRow(idx, { protein: e.target.value })
                            }
                            className="input"
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
                            className="input"
                            disabled={disableCount}
                            placeholder={
                              disableCount
                                ? `auto = ${nPeople}`
                                : isSplitMode
                                ? "e.g. 50"
                                : "Select proteins first"
                            }
                            title={
                              disableCount
                                ? "Single protein auto-fills to total people"
                                : isSplitMode
                                ? "Enter people count for this protein"
                                : "Select at least 2 proteins to split counts"
                            }
                          />

                          <button
                            type="button"
                            className="btn"
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
                  <div className="form-summary">
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
                          Protein split sum: <b>{totalProteinCount}</b> (must
                          equal total)
                        </div>
                      );
                    })()}
                  </div>
                </>
              )}
            </div>

            {/* notes */}
            <div className="field">
              <label className="label">Notes (optional)</label>
              <textarea
                className="textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any special notes for this batch..."
              />
            </div>

            <div className="actions stack-14">
              <button className="btn primary" type="submit" disabled={loading}>
                {loading ? "Creating…" : "Create Batch"}
              </button>

              <button
                className="btn"
                type="button"
                onClick={clearForm}
                disabled={loading}
              >
                Clear
              </button>
            </div>

            <p className="helper helper-spaced">
              Backend note: single-protein mode uses{" "}
              <code>options.protein</code>. Multi-protein mode sends{" "}
              <code>options.proteins</code> and needs backend support.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CookBatchCreateScreen;
