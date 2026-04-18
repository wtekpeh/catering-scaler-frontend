import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import RecipeForm from "../components/recipes/RecipeForm";
import { createRecipe } from "../actions/cookBatchActions";
import { RECIPE_CREATE_RESET } from "../constants/cookBatchConstants";

import "../styles/forms.css";
import "../styles/tables.css";

const RecipeManagementScreen = () => {
  const dispatch = useDispatch();

  const [showForm, setShowForm] = useState(false);

  const recipeCreate = useSelector((state) => state.recipeCreate);
  const { loading, error, success } = recipeCreate;

  useEffect(() => {
    if (success) {
      dispatch({ type: RECIPE_CREATE_RESET });
      setShowForm(false);
    }
  }, [success, dispatch]);

  const handleCreateRecipe = (payload) => {
    dispatch(createRecipe(payload));
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Recipe Management</h1>
            <p className="subtle">
              Manage recipes, ingredients, and CSV onboarding.
            </p>
          </div>
        </div>

        <div className="card pad section">
          <h2 className="page-title">Recipe Operations</h2>
          <p className="helper">
            This area handles recipe list, recipe detail, ingredient editing,
            and bulk CSV import.
          </p>

          <div className="actions recipe-management__actions stack-14">
            <button
              type="button"
              className="btn primary"
              onClick={() => setShowForm((prev) => !prev)}
            >
              {showForm ? "Close Form" : "Create Recipe"}
            </button>

            <Link to="/recipes/list" className="btn ghost">
              View Recipes
            </Link>

            <Link to="/recipes/upload" className="btn ghost">
              Upload CSV
            </Link>
          </div>

          {showForm && (
            <div className="recipe-detail__form-wrap">
              <RecipeForm
                mode="create"
                onSubmit={handleCreateRecipe}
                onCancel={() => {
                  setShowForm(false);
                  dispatch({ type: RECIPE_CREATE_RESET });
                }}
                loading={loading}
                error={error}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeManagementScreen;
