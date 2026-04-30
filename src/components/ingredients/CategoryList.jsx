import React from "react";

const CategoryList = ({
  categories,
  handleEditCategory,
  handleDeleteCategory,
}) => {
  return (
    <>
      <div className="table-wrap desktop-only stack-14">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.description || "-"}</td>
                <td>{cat.is_active ? "Yes" : "No"}</td>
                <td>
                  <div className="actions">
                    <button
                      className="btn ghost"
                      onClick={() => handleEditCategory(cat)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn warning"
                      onClick={() => handleDeleteCategory(cat.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-only batch-cards stack-14">
        {categories.map((cat) => (
          <div className="batch-card" key={cat.id}>
            <div className="batch-card__top">
              <div className="batch-card__title">{cat.name}</div>
            </div>

            <div className="batch-card__meta">
              <div>
                <b>Description:</b> {cat.description || "-"}
              </div>
            </div>

            <div className="actions stack-14">
              <button
                className="btn ghost"
                onClick={() => handleEditCategory(cat)}
              >
                Edit
              </button>

              <button
                className="btn warning"
                onClick={() => handleDeleteCategory(cat.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoryList;
