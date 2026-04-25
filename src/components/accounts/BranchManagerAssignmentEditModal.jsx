import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateBranchManagerAssignment } from "../../actions/cookBatchActions";
import { BRANCH_MANAGER_ASSIGNMENT_UPDATE_RESET } from "../../constants/cookBatchConstants";

const BranchManagerAssignmentEditModal = ({
  show,
  onClose,
  assignment,
  onSuccess,
}) => {
  const dispatch = useDispatch();

  const initialRole = useMemo(() => assignment?.role || "", [assignment]);
  const [role, setRole] = useState("");
  const [formError, setFormError] = useState("");

  const branchManagerAssignmentUpdateState = useSelector(
    (state) => state.branchManagerAssignmentUpdate,
  );
  const { loading, error, success } = branchManagerAssignmentUpdateState;

  useEffect(() => {
    if (show) {
      setRole(initialRole);
      setFormError("");
    }

    if (!show) {
      setRole("");
      setFormError("");
      dispatch({ type: BRANCH_MANAGER_ASSIGNMENT_UPDATE_RESET });
    }
  }, [dispatch, show, initialRole]);

  useEffect(() => {
    if (success && show) {
      dispatch({ type: BRANCH_MANAGER_ASSIGNMENT_UPDATE_RESET });
      onSuccess?.();
      onClose?.();
    }
  }, [dispatch, success, show, onClose, onSuccess]);

  if (!show || !assignment) return null;

  const closeHandler = () => {
    setRole(initialRole);
    setFormError("");
    dispatch({ type: BRANCH_MANAGER_ASSIGNMENT_UPDATE_RESET });
    onClose?.();
  };

  const submitHandler = (e) => {
    e.preventDefault();

    setFormError("");

    if (!assignment?.assignment_id) {
      setFormError("Assignment ID is missing.");
      return;
    }

    if (!role) {
      setFormError("Please select a role.");
      return;
    }

    dispatch(
      updateBranchManagerAssignment(assignment.assignment_id, {
        role,
      }),
    );
  };

  return (
    <div className="account-modal-overlay">
      <div className="account-modal">
        <div className="account-modal-header">
          <div>
            <h5 className="account-modal-title">Edit Branch Staff Role</h5>
            <div className="account-modal-subtitle">
              {assignment.full_name ||
                assignment.email ||
                `Assignment ${assignment.assignment_id}`}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={closeHandler}
            disabled={loading}
          >
            Close
          </button>
        </div>

        <form onSubmit={submitHandler}>
          <div className="account-modal-body">
            {formError && (
              <div className="alert alert-warning mb-3">{formError}</div>
            )}

            {error && <div className="alert alert-danger mb-3">{error}</div>}

            <div className="account-form-section">
              <div className="account-form-grid">
                <div className="account-field">
                  <label className="form-label fw-semibold">Staff</label>
                  <input
                    type="text"
                    className="form-control account-readonly-box"
                    value={assignment.full_name || ""}
                    disabled
                  />
                </div>

                <div className="account-field">
                  <label className="form-label fw-semibold">Branch</label>
                  <input
                    type="text"
                    className="form-control account-readonly-box"
                    value={assignment.branch_name || ""}
                    disabled
                  />
                </div>

                <div className="account-field">
                  <label
                    htmlFor="branch-manager-edit-role"
                    className="form-label fw-semibold"
                  >
                    Role
                  </label>
                  <select
                    id="branch-manager-edit-role"
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Select role</option>
                    <option value="chef">Chef</option>
                    <option value="kitchen_staff">Kitchen Staff</option>
                    <option value="store">Store</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="account-modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeHandler}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !role}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchManagerAssignmentEditModal;
