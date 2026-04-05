import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { listBranches } from "../../actions/cookBatchActions";
import BranchRoleEditor from "./BranchRoleEditor";

const UserRoleModal = ({ show, user, onClose, onSave, loading, error }) => {
  const dispatch = useDispatch();

  const [globalRole, setGlobalRole] = useState("none");
  const [isActive, setIsActive] = useState(true);
  const [branchRoles, setBranchRoles] = useState([]);
  const [formError, setFormError] = useState("");

  const branchListState = useSelector((state) => state.branchList);
  const {
    loading: loadingBranches,
    error: errorBranches,
    branches,
  } = branchListState;

  useEffect(() => {
    if (show) {
      dispatch(listBranches());
    }
  }, [dispatch, show]);

  useEffect(() => {
    if (show && user) {
      setGlobalRole(user.global_role || "none");
      setIsActive(Boolean(user.is_active));
      setFormError("");
      setBranchRoles(
        (user.branch_roles || []).map((item) => ({
          branch_id: item.branch_id,
          role: item.role,
          is_active: Boolean(item.is_active),
        })),
      );
    }

    if (!show) {
      setFormError("");
      setBranchRoles([]);
      setGlobalRole("none");
      setIsActive(true);
    }
  }, [show, user]);

  if (!show || !user) return null;

  const submitHandler = (e) => {
    e.preventDefault();

    setFormError("");

    const hasEmptyBranch = branchRoles.some(
      (item) => !item.branch_id || String(item.branch_id).trim() === "",
    );

    if (hasEmptyBranch) {
      setFormError("Every branch role must have a selected branch.");
      return;
    }

    const seen = new Set();
    for (const item of branchRoles) {
      const key = `${item.branch_id}-${item.role}`;
      if (seen.has(key)) {
        setFormError("Duplicate branch-role combinations are not allowed.");
        return;
      }
      seen.add(key);
    }

    onSave({
      global_role: globalRole,
      is_active: isActive,
      branch_roles: branchRoles,
    });
  };

  return (
    <div className="account-modal-overlay">
      <div className="account-modal">
        <div className="account-modal-header">
          <div>
            <h5 className="account-modal-title">Edit User Roles</h5>
            <div className="account-modal-subtitle">
              {user.full_name ||
                user.username ||
                user.email ||
                `User ${user.id}`}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
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
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    type="text"
                    className="form-control account-readonly-box"
                    value={user.full_name || ""}
                    disabled
                  />
                </div>

                <div className="account-field">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="text"
                    className="form-control account-readonly-box"
                    value={user.email || ""}
                    disabled
                  />
                </div>

                <div className="account-field">
                  <label className="form-label fw-semibold">Global Role</label>
                  <select
                    className="form-select"
                    value={globalRole}
                    onChange={(e) => setGlobalRole(e.target.value)}
                  >
                    <option value="none">None</option>
                    <option value="boss">Boss</option>
                    <option value="managing_director">Managing Director</option>
                  </select>
                </div>

                <div className="account-field account-field--checkbox">
                  <label className="form-label fw-semibold">User Status</label>
                  <div className="account-checkbox-box">
                    <div className="form-check m-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="edit_is_active"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="edit_is_active"
                      >
                        Active User
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {loadingBranches ? (
              <div className="alert alert-info">Loading branches...</div>
            ) : errorBranches ? (
              <div className="alert alert-danger">{errorBranches}</div>
            ) : (
              <div className="account-role-section">
                <BranchRoleEditor
                  branchRoles={branchRoles}
                  branches={branches || []}
                  onChange={setBranchRoles}
                />
              </div>
            )}
          </div>

          <div className="account-modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRoleModal;
