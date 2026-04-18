import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { uploadRecipeCsv } from "../actions/cookBatchActions";
import { RECIPE_CSV_UPLOAD_RESET } from "../constants/cookBatchConstants";

import "../styles/forms.css";
import "../styles/tables.css";

const RecipeCSVUploadScreen = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  const recipeCsvUpload = useSelector((state) => state.recipeCsvUpload);
  const { loading, error, success, result } = recipeCsvUpload;

  useEffect(() => {
    return () => {
      dispatch({ type: RECIPE_CSV_UPLOAD_RESET });
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      window.alert("Please select a CSV file.");
      return;
    }

    dispatch(uploadRecipeCsv(file));
  };

  const summary = result?.summary || {};
  const rowErrors = result?.row_errors || [];

  return (
    <div className="page">
      <div className="container container-sm">
        <div className="page-header">
          <div>
            <h1 className="page-title">Recipe CSV Upload</h1>
            <p className="subtle">Upload recipes and ingredients using CSV.</p>
          </div>

          <Link to="/recipes" className="btn ghost">
            Back
          </Link>
        </div>

        <div className="card pad">
          <form onSubmit={handleSubmit} className="csv-upload-form">
            <div className="field">
              <label className="label">Select CSV File</label>
              <input
                type="file"
                accept=".csv"
                className="input"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="csv-upload-actions">
              <button type="submit" className="btn primary" disabled={loading}>
                {loading ? "Uploading..." : "Upload CSV"}
              </button>
            </div>
          </form>

          {success && result ? (
            <div className="csv-upload-success">
              <h3>Upload Successful</h3>

              <p>
                <strong>Rows Processed:</strong> {summary.rows_processed || 0}
              </p>
              <p>
                <strong>Unique Recipes Processed:</strong>{" "}
                {summary.unique_recipes_processed || 0}
              </p>
              <p>
                <strong>Recipes Created:</strong> {summary.recipes_created || 0}
              </p>
              <p>
                <strong>Recipes Updated:</strong> {summary.recipes_updated || 0}
              </p>
              <p>
                <strong>Ingredients Created:</strong>{" "}
                {summary.ingredients_created || 0}
              </p>
              <p>
                <strong>Ingredients Updated:</strong>{" "}
                {summary.ingredients_updated || 0}
              </p>
            </div>
          ) : null}

          {error ? (
            <div className="csv-upload-error">
              <h3>Upload Failed</h3>
              <p>{error}</p>
            </div>
          ) : null}

          {rowErrors.length > 0 ? (
            <div className="csv-upload-errors">
              <h3>Row Errors</h3>

              <div className="csv-error-list">
                {rowErrors.map((err, index) => (
                  <div key={index} className="csv-error-card">
                    <div>
                      <strong>Row:</strong> {err.row}
                    </div>
                    <div>
                      <strong>Detail:</strong> {err.detail || "-"}
                    </div>
                    {err.first_seen_row ? (
                      <div>
                        <strong>First Seen Row:</strong> {err.first_seen_row}
                      </div>
                    ) : null}
                    {err.errors ? (
                      <pre className="helper csv-error-pre">
                        {JSON.stringify(err.errors, null, 2)}
                      </pre>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RecipeCSVUploadScreen;
