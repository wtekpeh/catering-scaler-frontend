import React from "react";

const IngredientAssignmentList = ({ filtered, categories, handleAssign }) => {
  return (
    <>
      <div className="table-wrap desktop-only">
        <table className="table">
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Group</th>
              <th>Category</th>
              <th>Assign</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.group || "-"}</td>
                <td>{item.category_name || "-"}</td>
                <td>
                  <select
                    className="input"
                    value={item.category || ""}
                    onChange={(e) =>
                      handleAssign(
                        item.ingredientIds,
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                  >
                    <option value="">Uncategorized</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-only batch-cards">
        {filtered.map((item) => (
          <div className="batch-card" key={item.name}>
            <div className="batch-card__title">{item.name}</div>

            <div className="batch-card__meta">
              <div>
                <b>Group:</b> {item.group || "-"}
              </div>

              <div>
                <b>Category:</b> {item.category_name || "-"}
              </div>
            </div>

            <select
              className="input"
              value={item.category || ""}
              onChange={(e) =>
                handleAssign(
                  item.ingredientIds,
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
            >
              <option value="">Uncategorized</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </>
  );
};

export default IngredientAssignmentList;
