import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

const DailyPlanRecipeRow = ({
  index,
  row,
  recipes = [],
  onChange,
  onRemove,
  canRemove = false,
}) => {
  const updateField = (field, value) => {
    const updated = {
      ...row,
      [field]: value,
    };

    if (field === "recipe_id") {
      updated.options = {};
    }

    onChange(index, updated);
  };

  const selectedRecipe = recipes.find(
    (recipe) => String(recipe.id) === String(row.recipe_id),
  );

  const [proteinChoices, setProteinChoices] = useState([]);
  const [loadingProteins, setLoadingProteins] = useState(false);
  const [errorProteins, setErrorProteins] = useState("");

  useEffect(() => {
    const fetchProteinChoices = async () => {
      if (!row.recipe_id) {
        setProteinChoices([]);
        return;
      }

      try {
        setLoadingProteins(true);
        setErrorProteins("");

        const { data } = await axios.get(
          `/api/recipes/protein-choices/?recipe_id=${row.recipe_id}`,
        );

        const choices = Array.isArray(data)
          ? data
          : data?.results || data?.protein_choices || [];

        console.log("Protein choices response:", data);
        console.log("Normalized protein choices:", choices);

        setProteinChoices(choices);
      } catch (error) {
        setProteinChoices([]);
        setErrorProteins("Could not load protein choices.");
      } finally {
        setLoadingProteins(false);
      }
    };

    fetchProteinChoices();
  }, [row.recipe_id]);

  const proteinRows = row.options?.proteins || [];

  const setProteinRows = (nextRows) => {
    const selectedNames = nextRows.map((p) => p.protein).filter(Boolean);

    updateField("options", {
      ...row.options,
      protein: selectedNames.join(" + "),
      proteins: nextRows,
    });
  };

  const addProteinRow = () => {
    setProteinRows([
      ...proteinRows,
      {
        protein: "",
        n_people: "",
      },
    ]);
  };

  const removeProteinRow = (proteinIndex) => {
    setProteinRows(proteinRows.filter((_, i) => i !== proteinIndex));
  };

  const updateProteinRow = (proteinIndex, field, value) => {
    setProteinRows(
      proteinRows.map((proteinRow, i) =>
        i === proteinIndex
          ? {
              ...proteinRow,
              [field]: value,
            }
          : proteinRow,
      ),
    );
  };

  const proteinTotal = proteinRows.reduce(
    (sum, proteinRow) => sum + Number(proteinRow.n_people || 0),
    0,
  );

  const hasProteinSplit = proteinRows.length > 0;

  return (
    <div className="card pad stack-12">
      <div className="row-between">
        <h4>
          {selectedRecipe?.name ? selectedRecipe.name : `Recipe ${index + 1}`}
        </h4>

        {canRemove && (
          <button
            type="button"
            className="btn danger"
            onClick={() => onRemove(index)}
          >
            Remove
          </button>
        )}
      </div>

      {loadingProteins && <p>Loading protein choices...</p>}
      {errorProteins && <p className="text-danger">{errorProteins}</p>}

      <div className="grid-2">
        <div className="field">
          <label className="label">Recipe</label>

          <select
            className="input"
            value={row.recipe_id}
            onChange={(e) => updateField("recipe_id", e.target.value)}
            required
          >
            <option value="">Select Recipe</option>

            {recipes.map((recipe) => (
              <option key={recipe.id} value={recipe.id}>
                {recipe.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="label">Number of People</label>

          <input
            type="number"
            min="1"
            className="input"
            value={row.n_people}
            onChange={(e) => {
              const nextPeople = e.target.value;

              onChange(index, {
                ...row,
                n_people: nextPeople,
                options: {
                  ...row.options,
                  proteins:
                    row.options?.proteins?.length === 1
                      ? [
                          {
                            ...row.options.proteins[0],
                            n_people: Number(nextPeople || 0),
                          },
                        ]
                      : row.options?.proteins || [],
                },
              });
            }}
            required
          />
        </div>
      </div>

      {/* PROTEIN SELECTION */}
      {proteinChoices.length > 0 && (
        <div className="card pad stack-12">
          <div className="row-between">
            <div>
              <label className="label">Protein Selection</label>
              <p className="helper">
                Select one protein or split people across multiple proteins.
              </p>
            </div>

            <button type="button" className="btn" onClick={addProteinRow}>
              + Add Protein
            </button>
          </div>

          {!hasProteinSplit && (
            <div className="field">
              <label className="label">Single Protein</label>

              <select
                className="input"
                value={row.options?.protein || ""}
                onChange={(e) =>
                  updateField("options", {
                    ...row.options,
                    protein: e.target.value,
                    proteins: [
                      {
                        protein: e.target.value,
                        n_people: Number(row.n_people || 0),
                      },
                    ],
                  })
                }
                required
              >
                <option value="">Select Protein</option>

                {proteinChoices.map((protein, idx) => {
                  const proteinValue =
                    typeof protein === "string"
                      ? protein
                      : protein.name || protein.value || "";

                  return (
                    <option key={idx} value={proteinValue}>
                      {proteinValue}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {hasProteinSplit && (
            <div className="stack-10">
              {proteinRows.map((proteinRow, proteinIndex) => (
                <div key={proteinIndex} className="grid-3">
                  <div className="field">
                    <label className="label">Protein</label>

                    <select
                      className="input"
                      value={proteinRow.protein || ""}
                      onChange={(e) =>
                        updateProteinRow(
                          proteinIndex,
                          "protein",
                          e.target.value,
                        )
                      }
                      required
                    >
                      <option value="">Select Protein</option>

                      {proteinChoices.map((protein, idx) => {
                        const proteinValue =
                          typeof protein === "string"
                            ? protein
                            : protein.name || protein.value || "";

                        return (
                          <option key={idx} value={proteinValue}>
                            {proteinValue}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="field">
                    <label className="label">People</label>

                    <input
                      type="number"
                      min="1"
                      className="input"
                      value={proteinRow.n_people}
                      onChange={(e) =>
                        updateProteinRow(
                          proteinIndex,
                          "n_people",
                          e.target.value,
                        )
                      }
                      required
                    />
                  </div>

                  <div className="field">
                    <label className="label">&nbsp;</label>

                    <button
                      type="button"
                      className="btn danger"
                      onClick={() => removeProteinRow(proteinIndex)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <p
                className={
                  proteinTotal === Number(row.n_people)
                    ? "text-success"
                    : "text-danger"
                }
              >
                Protein split total: {proteinTotal} / {row.n_people}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="field">
        <label className="label">Recipe Notes</label>

        <textarea
          className="input"
          rows="2"
          value={row.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          placeholder="Optional notes for this recipe..."
        />
      </div>
    </div>
  );
};

export default DailyPlanRecipeRow;
