import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  listRecipes,
  createDailyConsumptionPlan,
  getCurrentUser,
} from "../actions/cookBatchActions";

import DailyPlanRecipeRow from "../components/cooking/DailyPlanRecipeRow";

const DailyConsumptionPlanCreateScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ---------------------------------
  // LOCAL STATE
  // ---------------------------------

  const [branch, setBranch] = useState("");
  const [usedDate, setUsedDate] = useState("");
  const [notes, setNotes] = useState("");

  const [recipeRows, setRecipeRows] = useState([
    {
      recipe_id: "",
      n_people: 10,
      options: {},
      notes: "",
    },
    {
      recipe_id: "",
      n_people: 10,
      options: {},
      notes: "",
    },
  ]);

  // ---------------------------------
  // REDUX
  // ---------------------------------

  const recipeList = useSelector((state) => state.recipeList || {});
  const { loading, error, recipes = [] } = recipeList;

  const dailyPlanCreate = useSelector(
    (state) => state.dailyConsumptionPlanCreate || {},
  );

  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    plan: createdPlan,
  } = dailyPlanCreate;

  const userMe = useSelector((state) => state.userMe || {});
  const { user: currentUser } = userMe;

  const canCreateBatch = currentUser?.can_create_batch_any;

  const managedBranchRoles =
    currentUser?.branch_roles?.filter(
      (role) => role.role === "branch_manager" && role.is_active,
    ) || [];

  const isExecutiveUser =
    currentUser?.global_role === "boss" ||
    currentUser?.global_role === "managing_director";

  const shouldLockBranchToUser =
    !isExecutiveUser && managedBranchRoles.length === 1;

  const lockedBranch = shouldLockBranchToUser ? managedBranchRoles[0] : null;

  const selectedBranchId = lockedBranch
    ? String(lockedBranch.branch_id)
    : branch;

  const availableBranches = lockedBranch
    ? [{ id: lockedBranch.branch_id, name: lockedBranch.branch_name }]
    : currentUser?.branches || [];

  // ---------------------------------
  // EFFECTS
  // ---------------------------------

  useEffect(() => {
    dispatch(listRecipes());
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (successCreate && createdPlan?.id) {
      navigate(`/cooking/daily-plans/${createdPlan.id}`);
    }
  }, [successCreate, createdPlan, navigate]);

  // ---------------------------------
  // SUBMIT
  // ---------------------------------

  const addRecipeRow = () => {
    setRecipeRows((prev) => [
      ...prev,
      {
        recipe_id: "",
        n_people: 10,
        options: {},
        notes: "",
      },
    ]);
  };

  const removeRecipeRow = (index) => {
    setRecipeRows((prev) => prev.filter((_, i) => i !== index));
  };

  const updateRecipeRow = (index, updatedRow) => {
    setRecipeRows((prev) =>
      prev.map((row, i) => (i === index ? updatedRow : row)),
    );
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!selectedBranchId) {
      alert("Please select a site.");
      return;
    }

    if (!usedDate) {
      alert("Please select a used date.");
      return;
    }

    if (recipeRows.length < 2) {
      alert("Daily Consumption Plan requires at least two recipes.");
      return;
    }

    for (let i = 0; i < recipeRows.length; i += 1) {
      const row = recipeRows[i];
      const rowNumber = i + 1;

      if (!row.recipe_id) {
        alert(`Please select a recipe for row ${rowNumber}.`);
        return;
      }

      const nPeople = Number(row.n_people);

      if (!nPeople || nPeople <= 0) {
        alert(`Please enter a valid number of people for row ${rowNumber}.`);
        return;
      }

      const proteins = row.options?.proteins || [];

      if (proteins.length > 0) {
        const selectedProteins = proteins.filter((p) =>
          (p.protein || "").trim(),
        );

        if (selectedProteins.length !== proteins.length) {
          alert(`Please select all proteins for row ${rowNumber}.`);
          return;
        }

        const totalProteinPeople = selectedProteins.reduce(
          (sum, p) => sum + Number(p.n_people || 0),
          0,
        );

        if (selectedProteins.length === 1) {
          selectedProteins[0].n_people = nPeople;
        }

        if (selectedProteins.length > 1 && totalProteinPeople !== nPeople) {
          alert(
            `Protein split for row ${rowNumber} must total ${nPeople}. Current total is ${totalProteinPeople}.`,
          );
          return;
        }
      }
    }

    const payload = {
      branch_id: Number(selectedBranchId),
      used_date: usedDate,
      notes,
      recipes: recipeRows.map((row) => ({
        recipe_id: Number(row.recipe_id),
        n_people: Number(row.n_people),
        options: row.options || {},
        notes: row.notes || "",
      })),
    };

    dispatch(createDailyConsumptionPlan(payload));

    // next step:
    // recipes payload rows
  };

  return (
    <div className="page">
      <div className="page-shell">
        <div className="card pad stack-18">
          <div>
            <h1>Create Daily Consumption Plan</h1>

            <p className="helper">
              Create one daily plan containing multiple recipe consumptions.
            </p>
          </div>

          {error && <p className="text-danger">{error}</p>}

          {errorCreate && <p className="text-danger">{errorCreate}</p>}

          {successCreate && (
            <p className="text-success">
              Daily consumption plan created successfully.
            </p>
          )}

          {(loading || loadingCreate) && <p>Loading...</p>}

          <form onSubmit={submitHandler} className="stack-16">
            {/* BRANCH */}
            <div className="field">
              <label className="label">Site</label>

              <select
                className="input"
                value={selectedBranchId}
                onChange={(e) => setBranch(e.target.value)}
                disabled={shouldLockBranchToUser}
                required
              >
                <option value="">Select Site</option>

                {availableBranches.map((b) => (
                  <option key={b.id} value={String(b.id)}>
                    {b.name}
                  </option>
                ))}
              </select>

              {shouldLockBranchToUser && (
                <p className="helper">
                  Site is locked to your assigned branch.
                </p>
              )}
            </div>

            {/* USED DATE */}
            <div className="field">
              <label className="label">Used Date</label>

              <input
                type="date"
                className="input"
                value={usedDate}
                onChange={(e) => setUsedDate(e.target.value)}
                required
              />
            </div>

            {/* NOTES */}
            <div className="field">
              <label className="label">Notes</label>

              <textarea
                className="input"
                rows="4"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes..."
              />
            </div>

            {/* RECIPE ROWS */}
            <div className="card pad stack-12">
              <div className="row-between">
                <div>
                  <h3>Recipes</h3>
                  <p className="helper">
                    Add at least two recipes to create a Daily Consumption Plan.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn"
                  onClick={addRecipeRow}
                  disabled={loadingCreate}
                >
                  + Add Recipe
                </button>
              </div>

              <div className="stack-12">
                {recipeRows.map((row, index) => (
                  <DailyPlanRecipeRow
                    key={index}
                    index={index}
                    row={row}
                    recipes={recipes}
                    onChange={updateRecipeRow}
                    onRemove={removeRecipeRow}
                    canRemove={recipeRows.length > 2}
                  />
                ))}
              </div>
            </div>

            {/* SUBMIT */}
            <div className="actions">
              <button
                type="submit"
                className="btn primary"
                disabled={loadingCreate}
              >
                Create Daily Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DailyConsumptionPlanCreateScreen;
