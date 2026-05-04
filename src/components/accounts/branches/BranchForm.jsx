import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBranch,
  updateBranch,
  listBranches,
} from "../../../actions/cookBatchActions";
import {
  BRANCH_CREATE_RESET,
  BRANCH_UPDATE_RESET,
} from "../../../constants/cookBatchConstants";

const BranchForm = ({ branch = null, onClose }) => {
  const dispatch = useDispatch();

  const isEdit = Boolean(branch?.id);

  const {
    loading: createLoading,
    success: createSuccess,
    error: createError,
  } = useSelector((state) => state.branchCreate);

  const {
    loading: updateLoading,
    success: updateSuccess,
    error: updateError,
  } = useSelector((state) => state.branchUpdate);

  const [formData, setFormData] = useState({
    name: branch?.name || "",
    code: branch?.code || "",
    location: branch?.location || "",
    is_active: branch?.is_active ?? true,
  });

  const [localMessage, setLocalMessage] = useState(null);

  useEffect(() => {
    if (createSuccess) {
      setLocalMessage("Branch created successfully");
    }

    if (updateSuccess) {
      setLocalMessage("Branch updated successfully");
    }

    if (createSuccess || updateSuccess) {
      dispatch(listBranches());
      dispatch({ type: BRANCH_CREATE_RESET });
      dispatch({ type: BRANCH_UPDATE_RESET });

      setTimeout(() => {
        onClose();
      }, 800);
    }
  }, [createSuccess, updateSuccess, dispatch, onClose]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      location: formData.location.trim(),
      is_active: formData.is_active,
    };

    if (isEdit) {
      dispatch(updateBranch(branch.id, payload));
    } else {
      dispatch(createBranch(payload));
    }
  };

  const loading = createLoading || updateLoading;
  const error = createError || updateError;

  return (
    <div className="account-modal-overlay">
      <div className="account-modal">
        <div className="account-modal-header">
          <div>
            <h3 className="account-modal-title">
              {isEdit ? "Edit Site" : "Create Site"}
            </h3>
            <p className="account-modal-subtitle">
              {isEdit
                ? "Update site details and status."
                : "Create a new site for global users."}
            </p>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>
        </div>

        {localMessage && (
          <div className="alert alert-success">{localMessage}</div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="account-modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="account-form-section">
              <div className="account-form-grid">
                <div className="account-field">
                  <label className="form-label">Site Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="account-field">
                  <label className="form-label">Site Code</label>
                  <input
                    type="text"
                    name="code"
                    className="form-control"
                    value={formData.code}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Optional"
                  />
                </div>

                <div className="account-field">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Optional"
                  />
                </div>

                <div className="account-field account-field--checkbox">
                  <label className="form-label">Status</label>
                  <div className="account-checkbox-box">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      disabled={loading}
                      className="form-check-input me-2"
                    />
                    <span>Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="account-modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : isEdit ? "Update Site" : "Create Site"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchForm;
