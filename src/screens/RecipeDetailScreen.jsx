import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getRecipeDetail,
  listRecipeIngredients,
  createRecipeIngredient,
  updateRecipeIngredient,
  deleteRecipeIngredient,
  listIngredientCategories,
} from "../actions/cookBatchActions";

import RecipeIngredientForm from "../components/recipes/RecipeIngredientForm";
import RecipeIngredientActions from "../components/recipes/RecipeIngredientActions";
import {
  RECIPE_INGREDIENT_CREATE_RESET,
  RECIPE_INGREDIENT_UPDATE_RESET,
  RECIPE_INGREDIENT_DELETE_RESET,
} from "../constants/cookBatchConstants";

import "../styles/forms.css";
import "../styles/tables.css";

const RecipeDetailScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const recipeDetail = useSelector((state) => state.recipeDetail);
  const { loading, error, recipe } = recipeDetail;

  const recipeIngredientList = useSelector(
    (state) => state.recipeIngredientList,
  );
  const {
    loading: loadingIngredients,
    error: errorIngredients,
    ingredients,
  } = recipeIngredientList;

  const recipeIngredientCreate = useSelector(
    (state) => state.recipeIngredientCreate,
  );
  const {
    loading: creatingIngredient,
    error: createIngredientError,
    success: createIngredientSuccess,
  } = recipeIngredientCreate;

  const recipeIngredientUpdate = useSelector(
    (state) => state.recipeIngredientUpdate,
  );
  const {
    loading: updatingIngredient,
    error: updateIngredientError,
    success: updateIngredientSuccess,
  } = recipeIngredientUpdate;

  const recipeIngredientDelete = useSelector(
    (state) => state.recipeIngredientDelete,
  );
  const {
    loading: deletingIngredient,
    error: deleteIngredientError,
    success: deleteIngredientSuccess,
  } = recipeIngredientDelete;

  const ingredientCategoryList = useSelector(
    (state) => state.ingredientCategoryList,
  );

  const { categories = [] } = ingredientCategoryList;

  const [showIngredientForm, setShowIngredientForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getRecipeDetail(id));
      dispatch(listRecipeIngredients(id));
      dispatch(listIngredientCategories());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (createIngredientSuccess && id) {
      dispatch(listRecipeIngredients(id));
      dispatch({ type: RECIPE_INGREDIENT_CREATE_RESET });
      setShowIngredientForm(false);
    }
  }, [createIngredientSuccess, dispatch, id]);

  useEffect(() => {
    if (updateIngredientSuccess && id) {
      dispatch(listRecipeIngredients(id));
      dispatch({ type: RECIPE_INGREDIENT_UPDATE_RESET });
      setShowIngredientForm(false);
      setEditingIngredient(null);
    }
  }, [updateIngredientSuccess, dispatch, id]);

  useEffect(() => {
    if (deleteIngredientSuccess && id) {
      dispatch(listRecipeIngredients(id));
      dispatch({ type: RECIPE_INGREDIENT_DELETE_RESET });
    }
  }, [deleteIngredientSuccess, dispatch, id]);

  const handleCreateIngredient = (payload) => {
    dispatch(createRecipeIngredient(id, payload));
  };

  const handleUpdateIngredient = (payload) => {
    if (!editingIngredient?.id) return;
    dispatch(updateRecipeIngredient(editingIngredient.id, payload));
  };

  const handleEditIngredient = (item) => {
    setEditingIngredient(item);
    setShowIngredientForm(true);
    dispatch({ type: RECIPE_INGREDIENT_CREATE_RESET });
    dispatch({ type: RECIPE_INGREDIENT_UPDATE_RESET });
  };

  const handleDeleteIngredient = (item) => {
    const ok = window.confirm(`Delete ingredient "${item.name}"?`);
    if (!ok) return;

    dispatch(deleteRecipeIngredient(item.id));
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="form-page__title">Recipe Detail</h1>
            <p className="form-page__subtitle">
              View recipe information and managed ingredient rows.
            </p>
          </div>

          <Link to="/recipes/list" className="btn ghost">
            Back
          </Link>
        </div>

        {loading ? (
          <div className="card pad">
            <p>Loading recipe...</p>
          </div>
        ) : error ? (
          <div className="form-card">
            <div className="form-card__section">
              <p className="text-danger">{error}</p>
            </div>
          </div>
        ) : !recipe ? (
          <div className="form-card">
            <div className="form-card__section">
              <div className="empty-state">Recipe not found.</div>
            </div>
          </div>
        ) : (
          <>
            <div className="form-card">
              <div className="form-card__section">
                <div className="recipe-detail__top">
                  <div>
                    <h2 className="section-title">{recipe.name}</h2>
                    <p className="helper">{recipe.description || "-"}</p>
                  </div>

                  <span
                    className={`badge ${recipe.is_active ? "active" : "inactive"}`}
                  >
                    {recipe.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <div className="form-card">
              <div className="form-card__section">
                <div className="recipe-detail__header">
                  <h2 className="section-title">Ingredients</h2>

                  <button
                    type="button"
                    className="btn primary"
                    onClick={() => {
                      if (showIngredientForm) {
                        setShowIngredientForm(false);
                        setEditingIngredient(null);
                        dispatch({ type: RECIPE_INGREDIENT_CREATE_RESET });
                        dispatch({ type: RECIPE_INGREDIENT_UPDATE_RESET });
                      } else {
                        setEditingIngredient(null);
                        setShowIngredientForm(true);
                      }
                    }}
                  >
                    {showIngredientForm
                      ? "Close Form"
                      : editingIngredient
                        ? "Edit Ingredient"
                        : "Add Ingredient"}
                  </button>
                </div>

                {showIngredientForm && (
                  <div className="recipe-detail__form-wrap">
                    <RecipeIngredientForm
                      mode={editingIngredient ? "edit" : "create"}
                      initialData={editingIngredient}
                      categories={categories}
                      onSubmit={
                        editingIngredient
                          ? handleUpdateIngredient
                          : handleCreateIngredient
                      }
                      onCancel={() => {
                        setShowIngredientForm(false);
                        setEditingIngredient(null);
                        dispatch({ type: RECIPE_INGREDIENT_CREATE_RESET });
                        dispatch({ type: RECIPE_INGREDIENT_UPDATE_RESET });
                      }}
                      loading={creatingIngredient || updatingIngredient}
                      error={createIngredientError || updateIngredientError}
                    />
                  </div>
                )}

                {deleteIngredientError ? (
                  <p className="text-danger">{deleteIngredientError}</p>
                ) : null}

                {loadingIngredients ? (
                  <p>Loading ingredients...</p>
                ) : errorIngredients ? (
                  <p className="text-danger">{errorIngredients}</p>
                ) : !ingredients || ingredients.length === 0 ? (
                  <div className="empty-state">
                    No ingredients found for this recipe.
                  </div>
                ) : (
                  <>
                    <div className="table-wrap desktop-only">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Item No</th>
                            <th>Name</th>
                            <th>Group</th>
                            <th>Q10 (g)</th>
                            <th>B</th>
                            <th>C (g)</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ingredients.map((item) => (
                            <tr key={item.id}>
                              <td>{item.item_no ?? "-"}</td>
                              <td>{item.name}</td>
                              <td>{item.group}</td>
                              <td>{item.q10_g}</td>
                              <td>{item.b}</td>
                              <td>{item.c_g}</td>
                              <td>{item.is_active ? "Active" : "Inactive"}</td>
                              <td>
                                <RecipeIngredientActions
                                  item={item}
                                  onEdit={handleEditIngredient}
                                  onDelete={handleDeleteIngredient}
                                  deleting={deletingIngredient}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mobile-only batch-cards">
                      {ingredients.map((item) => (
                        <div key={item.id} className="recipe-ingredient-card">
                          <div className="recipe-ingredient-card__top">
                            <h3>{item.name}</h3>
                            <span
                              className={`badge ${item.is_active ? "active" : "inactive"}`}
                            >
                              {item.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>

                          <div className="recipe-ingredient-card__grid">
                            <div>
                              <strong>Item No:</strong> {item.item_no ?? "-"}
                            </div>
                            <div>
                              <strong>Group:</strong> {item.group}
                            </div>
                            <div>
                              <strong>Q10 (g):</strong> {item.q10_g}
                            </div>
                            <div>
                              <strong>B:</strong> {item.b}
                            </div>
                            <div>
                              <strong>C (g):</strong> {item.c_g}
                            </div>
                          </div>

                          <div className="recipe-ingredient-card__actions">
                            <RecipeIngredientActions
                              item={item}
                              onEdit={handleEditIngredient}
                              onDelete={handleDeleteIngredient}
                              deleting={deletingIngredient}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeDetailScreen;
