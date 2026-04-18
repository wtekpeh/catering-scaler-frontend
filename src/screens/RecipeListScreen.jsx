import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { listRecipes } from "../actions/cookBatchActions";
import "../styles/forms.css";

const RecipeListScreen = () => {
  const dispatch = useDispatch();

  const recipeList = useSelector((state) => state.recipeList);
  const { loading, error, recipes } = recipeList;

  useEffect(() => {
    dispatch(listRecipes());
  }, [dispatch]);

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
