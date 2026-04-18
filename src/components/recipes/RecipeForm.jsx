import { useEffect, useState } from "react";

const RecipeForm = ({
  mode = "create",
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  error = "",
}) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  useEffect(() => {
    if (!initialData) return;

    setForm({
      name: initialData.name || "",
      description: initialData.description || "",
      is_active:
        initialData.is_active === undefined
          ? true
          : Boolean(initialData.is_active),
    });
  }, [initialData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      is_active: Boolean(form.is_active),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error ? <div className="post-review-modal__error">{error}</div> : null}

      <div className="field">
        <label className="label">Recipe Name</label>
        <input
          className="input"
          value={form.name}
          disabled={loading}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label className="label">Description</label>
        <textarea
          className="textarea"
          value={form.description}
          disabled={loading}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div className="field">
        <label>
          <input
            type="checkbox"
            checked={form.is_active}
            disabled={loading}
            onChange={(e) => handleChange("is_active", e.target.checked)}
          />{" "}
          Active
        </label>
      </div>

      <div className="recipe-form-actions">
        <button
          type="button"
          className="btn ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>

        <button type="submit" className="btn primary" disabled={loading}>
          {loading
            ? "Saving..."
            : mode === "edit"
              ? "Update Recipe"
              : "Create Recipe"}
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;
