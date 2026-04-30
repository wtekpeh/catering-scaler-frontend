import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CategoryForm from "../components/ingredients/CategoryForm";
import CategoryList from "../components/ingredients/CategoryList";
import IngredientAssignmentList from "../components/ingredients/IngredientAssignmentList";

import {
  listAllRecipeIngredients,
  listIngredientCategories,
  createIngredientCategory,
  updateIngredientCategory,
  deleteIngredientCategory,
  assignCategoryToRecipeIngredient,
} from "../actions/cookBatchActions";

const IngredientCategoryManagementScreen = () => {
  const dispatch = useDispatch();

  const { ingredients = [], loading } = useSelector(
    (state) => state.recipeIngredientGlobalList,
  );

  const { categories = [] } = useSelector(
    (state) => state.ingredientCategoryList,
  );

  const [filter, setFilter] = useState("");

  const [categoryForm, setCategoryForm] = useState({
    id: null,
    name: "",
    description: "",
  });

  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    dispatch(listAllRecipeIngredients());
    dispatch(listIngredientCategories());
  }, [dispatch]);

  const handleAssign = async (ingredientIds, categoryId) => {
    const scrollY = window.scrollY;

    await Promise.all(
      ingredientIds.map((id) =>
        dispatch(assignCategoryToRecipeIngredient(id, categoryId)),
      ),
    );

    await dispatch(listAllRecipeIngredients());

    requestAnimationFrame(() => {
      window.scrollTo({
        top: scrollY,
        behavior: "auto",
      });
    });
  };

  const grouped = Object.values(
    ingredients.reduce((acc, item) => {
      const key = item.name.toLowerCase();

      if (!acc[key]) {
        acc[key] = {
          name: item.name,
          group: item.group,
          category: item.category,
          category_name: item.category_name,
          ingredientIds: [],
        };
      }

      acc[key].ingredientIds.push(item.id);

      return acc;
    }, {}),
  );

  const filtered = grouped.filter((i) =>
    i.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const resetCategoryForm = () => {
    setCategoryForm({
      id: null,
      name: "",
      description: "",
    });
    setShowCategoryForm(false);
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: categoryForm.name.trim(),
      description: categoryForm.description.trim(),
      is_active: true,
    };

    if (!payload.name) return;

    if (categoryForm.id) {
      dispatch(updateIngredientCategory(categoryForm.id, payload)).then(() => {
        dispatch(listIngredientCategories());
        resetCategoryForm();
      });
    } else {
      dispatch(createIngredientCategory(payload)).then(() => {
        dispatch(listIngredientCategories());
        resetCategoryForm();
      });
    }
  };

  const handleEditCategory = (category) => {
    setCategoryForm({
      id: category.id,
      name: category.name || "",
      description: category.description || "",
    });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = (categoryId) => {
    if (
      !window.confirm(
        "Delete this category? Ingredients will become uncategorized if backend allows it.",
      )
    ) {
      return;
    }

    dispatch(deleteIngredientCategory(categoryId)).then(() => {
      dispatch(listIngredientCategories());
      dispatch(listAllRecipeIngredients());
    });
  };

  return (
    <div className="container">
      <h2>Ingredient Category Management</h2>

      <input
        type="text"
        placeholder="Search ingredient..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="input"
        style={{ marginBottom: 12 }}
      />

      {/* CATEGORY SECTION */}
      <div className="card pad stack-14">
        <div className="page-header">
          <div>
            <h3 className="page-title">Categories</h3>
            <p className="helper">Create and manage ingredient categories.</p>
          </div>

          <button
            className="btn primary"
            onClick={() => setShowCategoryForm((prev) => !prev)}
          >
            {showCategoryForm ? "Close Form" : "Add Category"}
          </button>
        </div>

        <CategoryForm
          categoryForm={categoryForm}
          setCategoryForm={setCategoryForm}
          showCategoryForm={showCategoryForm}
          setShowCategoryForm={setShowCategoryForm}
          handleCategorySubmit={handleCategorySubmit}
          resetCategoryForm={resetCategoryForm}
        />

        <CategoryList
          categories={categories}
          handleEditCategory={handleEditCategory}
          handleDeleteCategory={handleDeleteCategory}
        />
      </div>

      {/* INGREDIENT ASSIGNMENT */}
      <div className="card pad stack-14">
        <div className="page-header">
          <div>
            <h3 className="page-title">Ingredient Assignments</h3>
            <p className="helper">
              Assign each unique ingredient to a reporting category.
            </p>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <IngredientAssignmentList
            filtered={filtered}
            categories={categories}
            handleAssign={handleAssign}
          />
        )}
      </div>
    </div>
  );
};

export default IngredientCategoryManagementScreen;
