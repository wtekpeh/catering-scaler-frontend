import React from "react";

const CategoryForm = ({
  categoryForm,
  setCategoryForm,
  showCategoryForm,
  setShowCategoryForm,
  handleCategorySubmit,
  resetCategoryForm,
}) => {
  if (!showCategoryForm) return null;

  return (
    <form onSubmit={handleCategorySubmit} className="stack-14">
      <div className="field">
        <label className="label">Category Name</label>
        <input
          className="input"
          value={categoryForm.name}
          onChange={(e) =>
            setCategoryForm((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />
      </div>

      <div className="field">
        <label className="label">Description</label>
        <textarea
          className="textarea"
          rows="3"
          value={categoryForm.description}
          onChange={(e) =>
            setCategoryForm((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
      </div>

      <div className="actions">
        <button type="submit" className="btn primary">
          {categoryForm.id ? "Update Category" : "Create Category"}
        </button>

        <button type="button" className="btn ghost" onClick={resetCategoryForm}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
