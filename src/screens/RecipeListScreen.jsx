import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  getCurrentUser,
  listRecipes,
  lockRecipeActuals,
  unlockRecipeActuals,
} from "../actions/cookBatchActions";
import "../styles/forms.css";

const RecipeListScreen = () => {
  const dispatch = useDispatch();
  const userMe = useSelector((state) => state.userMe);
  const { user } = userMe;

  const recipeList = useSelector((state) => state.recipeList);
  const { loading, error, recipes } = recipeList;

  const recipeActualsLock = useSelector((state) => state.recipeActualsLock);

  const {
    loading: locking,
    success: lockSuccess,
    error: lockError,
  } = recipeActualsLock;

  const recipeActualsUnlock = useSelector((state) => state.recipeActualsUnlock);

  const {
    loading: unlocking,
    success: unlockSuccess,
    error: unlockError,
  } = recipeActualsUnlock;

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    dispatch(listRecipes());
  }, [dispatch]);

  useEffect(() => {
    if (lockSuccess || unlockSuccess) {
      dispatch(listRecipes());
    }
  }, [lockSuccess, unlockSuccess, dispatch]);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="form-page__title">Recipes</h1>
            <p className="form-page__subtitle">
              View and manage recipes and their ingredients.
            </p>
          </div>

          <Link to="/recipes" className="btn ghost">
            Back
          </Link>
        </div>

        {lockSuccess && (
          <div className="alert alert-success">
            Recipe actual editing locked successfully.
          </div>
        )}

        {unlockSuccess && (
          <div className="alert alert-success">
            Recipe actual editing unlocked successfully.
          </div>
        )}

        {lockError && <div className="alert alert-danger">{lockError}</div>}

        {unlockError && <div className="alert alert-danger">{unlockError}</div>}

        {lockError && <div className="alert alert-danger">{lockError}</div>}

        <div className="card pad">
          {loading ? (
            <p>Loading recipes...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : !recipes || recipes.length === 0 ? (
            <div className="empty-state">No recipes found.</div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="table-wrap desktop-only">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Ingredients</th>
                      <th>Actual Editing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipes.map((recipe) => (
                      <tr key={recipe.id}>
                        <td>
                          <Link
                            to={`/recipes/${recipe.id}`}
                            className="recipe-link"
                          >
                            {recipe.name}
                          </Link>
                        </td>
                        <td>{recipe.description || "-"}</td>
                        <td>{recipe.is_active ? "Active" : "Inactive"}</td>
                        <td>{recipe.ingredients?.length || 0}</td>
                        <td>
                          {recipe.actuals_locked ? (
                            <div>
                              <span className="badge bg-warning">
                                🔒 Locked
                              </span>

                              <div className="text-muted small mt-1">
                                {recipe.actuals_locked_by_name
                                  ? `By ${recipe.actuals_locked_by_name}`
                                  : "Locked"}
                                {recipe.actuals_locked_at
                                  ? ` on ${new Date(recipe.actuals_locked_at).toLocaleString()}`
                                  : ""}
                              </div>

                              {user?.can_recalibrate && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-success mt-1"
                                  disabled={unlocking}
                                  onClick={() => {
                                    const ok = window.confirm(
                                      `Unlock actual editing for ${recipe.name}?`,
                                    );
                                    if (ok)
                                      dispatch(unlockRecipeActuals(recipe.id));
                                  }}
                                >
                                  {unlocking ? "Unlocking..." : "Unlock"}
                                </button>
                              )}
                            </div>
                          ) : (
                            user?.can_recalibrate && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                disabled={locking}
                                onClick={() => {
                                  const ok = window.confirm(
                                    `Lock actual editing for ${recipe.name}?`,
                                  );
                                  if (ok)
                                    dispatch(lockRecipeActuals(recipe.id));
                                }}
                              >
                                {locking ? "Locking..." : "Lock"}
                              </button>
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="mobile-only batch-cards">
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="recipe-card">
                    <div className="recipe-card__top">
                      <h3>
                        <Link
                          to={`/recipes/${recipe.id}`}
                          className="recipe-link"
                        >
                          {recipe.name}
                        </Link>
                      </h3>
                      <span
                        className={`badge ${recipe.is_active ? "active" : "inactive"}`}
                      >
                        {recipe.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <p className="recipe-card__desc">
                      {recipe.description || "-"}
                    </p>

                    <div className="recipe-card__meta">
                      Ingredients: {recipe.ingredients?.length || 0}
                    </div>
                    <div className="recipe-card__meta" style={{ marginTop: 8 }}>
                      <b>Actual Editing:</b>{" "}
                      {recipe.actuals_locked ? (
                        <>
                          <span className="badge bg-warning">🔒 Locked</span>

                          <div className="text-muted small mt-1">
                            {recipe.actuals_locked_by_name
                              ? `By ${recipe.actuals_locked_by_name}`
                              : "Locked"}
                            {recipe.actuals_locked_at
                              ? ` on ${new Date(recipe.actuals_locked_at).toLocaleString()}`
                              : ""}
                          </div>

                          {user?.can_recalibrate && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success mt-1"
                              disabled={unlocking}
                              onClick={() => {
                                const ok = window.confirm(
                                  `Unlock actual editing for ${recipe.name}?`,
                                );
                                if (ok)
                                  dispatch(unlockRecipeActuals(recipe.id));
                              }}
                            >
                              {unlocking ? "Unlocking..." : "Unlock"}
                            </button>
                          )}
                        </>
                      ) : (
                        user?.can_recalibrate && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            style={{ marginLeft: 8 }}
                            disabled={locking}
                            onClick={() => {
                              const ok = window.confirm(
                                `Lock actual editing for ${recipe.name}?`,
                              );
                              if (ok) dispatch(lockRecipeActuals(recipe.id));
                            }}
                          >
                            {locking ? "Locking..." : "Lock"}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeListScreen;
