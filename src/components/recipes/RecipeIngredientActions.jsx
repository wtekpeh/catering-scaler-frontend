const RecipeIngredientActions = ({
  item,
  onEdit,
  onDelete,
  deleting = false,
}) => {
  return (
    <div className="recipe-ingredient-actions">
      <button type="button" className="btn ghost" onClick={() => onEdit(item)}>
        Edit
      </button>

      <button
        type="button"
        className="btn warning"
        onClick={() => onDelete(item)}
        disabled={deleting}
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
};

export default RecipeIngredientActions;
