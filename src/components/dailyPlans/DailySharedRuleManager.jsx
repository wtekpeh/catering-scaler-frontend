import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  listDailySharedRules,
  createDailySharedRule,
  updateDailySharedRule,
  deleteDailySharedRule,
} from "../../actions/cookBatchActions";

const DailySharedRuleManager = () => {
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");
  const [factor, setFactor] = useState("0.95");

  const {
    loading,
    error,
    rules = [],
  } = useSelector((state) => state.dailySharedRuleList) || {};

  const {
    loading: createLoading,
    success: createSuccess,
    error: createError,
  } = useSelector((state) => state.dailySharedRuleCreate) || {};

  const {
    loading: updateLoading,
    success: updateSuccess,
    error: updateError,
  } = useSelector((state) => state.dailySharedRuleUpdate) || {};

  const {
    loading: deleteLoading,
    success: deleteSuccess,
    error: deleteError,
  } = useSelector((state) => state.dailySharedRuleDelete) || {};

  useEffect(() => {
    dispatch(listDailySharedRules());
  }, [dispatch, createSuccess, updateSuccess, deleteSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!keyword.trim()) return;

    dispatch(
      createDailySharedRule({
        keyword: keyword.trim(),
        factor: parseFloat(factor || "0.95"),
        is_active: true,
      }),
    );

    setKeyword("");
    setFactor("0.95");
  };

  const toggleActive = (rule) => {
    dispatch(
      updateDailySharedRule(rule.id, {
        is_active: !rule.is_active,
      }),
    );
  };

  const deleteHandler = (ruleId) => {
    if (window.confirm("Delete this shared ingredient rule?")) {
      dispatch(deleteDailySharedRule(ruleId));
    }
  };

  return (
    <div className="card pad stack-16">
      <div className="section-header">
        <div>
          <h3>Shared Ingredient Rules</h3>
          <p className="helper">
            Controls which ingredients participate in daily-plan shared
            learning.
          </p>
        </div>
      </div>

      <form onSubmit={submitHandler} className="actions wrap">
        <input
          className="input"
          type="text"
          placeholder="Keyword e.g. pepper"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <input
          className="input"
          type="number"
          step="0.01"
          min="0"
          value={factor}
          onChange={(e) => setFactor(e.target.value)}
        />

        <button type="submit" className="btn primary" disabled={createLoading}>
          {createLoading ? "Adding..." : "Add Rule"}
        </button>
      </form>

      {loading && <p>Loading rules...</p>}

      {error && <p className="text-danger">{error}</p>}
      {createError && <p className="text-danger">{createError}</p>}
      {updateError && <p className="text-danger">{updateError}</p>}
      {deleteError && <p className="text-danger">{deleteError}</p>}

      <div className="desktop-only">
        <div className="table-wrap" style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Factor</th>
                <th>Active</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {rules.length === 0 ? (
                <tr>
                  <td colSpan="5">No shared ingredient rules yet.</td>
                </tr>
              ) : (
                rules.map((rule) => (
                  <tr key={rule.id}>
                    <td>{rule.keyword}</td>
                    <td>{rule.factor}</td>
                    <td>{rule.is_active ? "Yes" : "No"}</td>
                    <td>{rule.created_by_name || "-"}</td>

                    <td className="actions wrap">
                      <button
                        type="button"
                        className="btn"
                        onClick={() => toggleActive(rule)}
                        disabled={updateLoading}
                      >
                        {rule.is_active ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        type="button"
                        className="btn danger"
                        onClick={() => deleteHandler(rule.id)}
                        disabled={deleteLoading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mobile-only">
        <div className="stack-12">
          {rules.length === 0 ? (
            <p>No shared ingredient rules yet.</p>
          ) : (
            rules.map((rule) => (
              <div key={`mobile-${rule.id}`} className="card pad stack-10">
                <div>
                  <strong>Keyword:</strong> {rule.keyword}
                </div>

                <div>
                  <strong>Factor:</strong> {rule.factor}
                </div>

                <div>
                  <strong>Active:</strong> {rule.is_active ? "Yes" : "No"}
                </div>

                <div>
                  <strong>Created By:</strong> {rule.created_by_name || "-"}
                </div>

                <div className="actions wrap">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => toggleActive(rule)}
                    disabled={updateLoading}
                  >
                    {rule.is_active ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    type="button"
                    className="btn danger"
                    onClick={() => deleteHandler(rule.id)}
                    disabled={deleteLoading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DailySharedRuleManager;
