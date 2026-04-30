import { useEffect, useState } from "react";

const GROUP_OPTIONS = [
  "bulk",
  "medium",
  "aromatic",
  "seasoning",
  "protein",
  "other",
];

const RecipeIngredientForm = ({
  mode = "create",
  initialData = null,
  categories = [],
  onSubmit,
  onCancel,
  loading = false,
  error = "",
}) => {
  const [form, setForm] = useState({
    item_no: "",
    name: "",
    group: "other",
    category: "",
    q10_g: "",
    b: "1",
    c_g: "0",
    min_per_person_g: "",
    max_per_person_g: "",
    option_group: "",
    option_value: "",
    is_active: true,
  });

  useEffect(() => {
    if (!initialData) return;

    setForm({
      item_no:
        initialData.item_no === null || initialData.item_no === undefined
          ? ""
          : String(initialData.item_no),
      name: initialData.name || "",
      group: initialData.group || "other",
      category:
        initialData.category === null || initialData.category === undefined
          ? ""
          : String(initialData.category),
      q10_g:
        initialData.q10_g === null || initialData.q10_g === undefined
          ? ""
          : String(initialData.q10_g),
      b:
        initialData.b === null || initialData.b === undefined
          ? "1"
          : String(initialData.b),
      c_g:
        initialData.c_g === null || initialData.c_g === undefined
          ? "0"
          : String(initialData.c_g),
      min_per_person_g:
        initialData.min_per_person_g === null ||
        initialData.min_per_person_g === undefined
          ? ""
          : String(initialData.min_per_person_g),
      max_per_person_g:
        initialData.max_per_person_g === null ||
        initialData.max_per_person_g === undefined
          ? ""
          : String(initialData.max_per_person_g),
      option_group: initialData.option_group || "",
      option_value: initialData.option_value || "",
      is_active:
        initialData.is_active === null || initialData.is_active === undefined
          ? true
          : Boolean(initialData.is_active),
    });
  }, [initialData]);

  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "group" && value === "protein") {
        next.option_group = "protein";
      }

      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      item_no: form.item_no === "" ? null : Number(form.item_no),
      name: form.name.trim(),
      group: form.group,
      category: form.category === "" ? null : Number(form.category),
      q10_g: Number(form.q10_g),
      b: Number(form.b),
      c_g: Number(form.c_g),
      min_per_person_g:
        form.min_per_person_g === "" ? null : Number(form.min_per_person_g),
      max_per_person_g:
        form.max_per_person_g === "" ? null : Number(form.max_per_person_g),
      option_group: form.option_group.trim(),
      option_value: form.option_value.trim(),
      is_active: Boolean(form.is_active),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="recipe-ingredient-form">
      {error ? <div className="post-review-modal__error">{error}</div> : null}

      <div className="recipe-ingredient-form__grid">
        <div>
          <label className="label">Item No</label>
          <input
            className="input"
            type="number"
            value={form.item_no}
            disabled={loading}
            onChange={(e) => handleChange("item_no", e.target.value)}
          />
        </div>

        <div>
          <label className="label">Ingredient Name</label>
          <input
            className="input"
            type="text"
            value={form.name}
            disabled={loading}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">Group</label>
          <select
            className="input"
            value={form.group}
            disabled={loading}
            onChange={(e) => handleChange("group", e.target.value)}
          >
            {GROUP_OPTIONS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Category</label>
          <select
            className="input"
            value={form.category}
            disabled={loading}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            <option value="">Uncategorized</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Q10 (g)</label>
          <input
            className="input"
            type="number"
            step="0.01"
            value={form.q10_g}
            disabled={loading}
            onChange={(e) => handleChange("q10_g", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">B</label>
          <input
            className="input"
            type="number"
            step="0.01"
            value={form.b}
            disabled={loading}
            onChange={(e) => handleChange("b", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">C (g)</label>
          <input
            className="input"
            type="number"
            step="0.01"
            value={form.c_g}
            disabled={loading}
            onChange={(e) => handleChange("c_g", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">Min Per Person (g)</label>
          <input
            className="input"
            type="number"
            step="0.01"
            value={form.min_per_person_g}
            disabled={loading}
            onChange={(e) => handleChange("min_per_person_g", e.target.value)}
          />
        </div>

        <div>
          <label className="label">Max Per Person (g)</label>
          <input
            className="input"
            type="number"
            step="0.01"
            value={form.max_per_person_g}
            disabled={loading}
            onChange={(e) => handleChange("max_per_person_g", e.target.value)}
          />
        </div>

        <div>
          <label className="label">Option Group</label>
          <input
            className="input"
            type="text"
            value={form.option_group}
            disabled={loading}
            onChange={(e) => handleChange("option_group", e.target.value)}
          />
        </div>

        <div>
          <label className="label">Option Value</label>
          <input
            className="input"
            type="text"
            value={form.option_value}
            disabled={loading}
            onChange={(e) => handleChange("option_value", e.target.value)}
          />
        </div>

        <div className="recipe-ingredient-form__checkbox">
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
      </div>

      <div className="recipe-ingredient-form__actions">
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
              ? "Update Ingredient"
              : "Add Ingredient"}
        </button>
      </div>
    </form>
  );
};

export default RecipeIngredientForm;
