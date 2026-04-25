import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  listBranchManagerBranches,
  searchBranchManagerUsers,
  createBranchManagerAssignment,
} from "../../actions/cookBatchActions";
import {
  BRANCH_MANAGER_USER_SEARCH_RESET,
  BRANCH_MANAGER_ASSIGNMENT_CREATE_RESET,
} from "../../constants/cookBatchConstants";

const BranchManagerAssignmentCreateModal = ({ show, onClose, onSuccess }) => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [role, setRole] = useState("");
  const [formError, setFormError] = useState("");

  const branchManagerUserSearchState = useSelector(
    (state) => state.branchManagerUserSearch,
  );
  const {
    loading: searchLoading,
    error: searchError,
    users: searchedUsers,
  } = branchManagerUserSearchState;

  const branchManagerBranchListState = useSelector(
    (state) => state.branchManagerBranchList,
  );
  const {
    loading: branchesLoading,
    error: branchesError,
    branches,
  } = branchManagerBranchListState;

  const branchManagerAssignmentCreateState = useSelector(
    (state) => state.branchManagerAssignmentCreate,
  );
  const {
    loading: createLoading,
    error: createError,
    success: createSuccess,
  } = branchManagerAssignmentCreateState;

  const managedBranches = useMemo(() => branches || [], [branches]);

  useEffect(() => {
    if (show) {
      dispatch(listBranchManagerBranches());

      if (managedBranches.length === 1) {
        setSelectedBranchId(String(managedBranches[0].id));
      }
    }

    if (!show) {
      setSearchTerm("");
      setSelectedUserId("");
      setSelectedBranchId("");
      setRole("");
      setFormError("");
      dispatch({ type: BRANCH_MANAGER_USER_SEARCH_RESET });
      dispatch({ type: BRANCH_MANAGER_ASSIGNMENT_CREATE_RESET });
    }
  }, [dispatch, show, managedBranches]);

  useEffect(() => {
    if (show && searchedUsers?.length === 1) {
      setSelectedUserId(String(searchedUsers[0].id));
    }
  }, [searchedUsers, show]);

  useEffect(() => {
    if (createSuccess && show) {
      dispatch({ type: BRANCH_MANAGER_ASSIGNMENT_CREATE_RESET });
      dispatch({ type: BRANCH_MANAGER_USER_SEARCH_RESET });
      onSuccess?.();
      onClose?.();
    }
  }, [dispatch, createSuccess, show, onClose, onSuccess]);

  if (!show) return null;

  const closeHandler = () => {
    setSearchTerm("");
    setSelectedUserId("");
    setSelectedBranchId(
      managedBranches.length === 1 ? String(managedBranches[0].id) : "",
    );
    setRole("");
    setFormError("");
    dispatch({ type: BRANCH_MANAGER_USER_SEARCH_RESET });
    dispatch({ type: BRANCH_MANAGER_ASSIGNMENT_CREATE_RESET });
    onClose?.();
  };

  const searchHandler = (e) => {
    e.preventDefault();

    setFormError("");
    setSelectedUserId("");

    const trimmed = searchTerm.trim();

    if (!trimmed) {
      setFormError("Enter a name, username, or email to search.");
      return;
    }

    dispatch(searchBranchManagerUsers(trimmed));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    setFormError("");

    if (!selectedUserId) {
      setFormError("Please select a user.");
      return;
    }

    if (!selectedBranchId) {
      setFormError("Please select a branch.");
      return;
    }

    if (!role) {
      setFormError("Please select a role.");
      return;
    }

    dispatch(
      createBranchManagerAssignment({
        user_id: selectedUserId,
        branch_id: selectedBranchId,
        role,
      }),
    );
  };

  return (
    <div className="account-modal-overlay">
      <div className="account-modal">
        <div className="account-modal-header">
          <div>
            <h5 className="account-modal-title">Add Branch Staff</h5>
            <div className="account-modal-subtitle">
              Search an existing user and assign them to a managed branch
            </div>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={closeHandler}
            disabled={createLoading}
          >
            Close
          </button>
        </div>

        <form onSubmit={submitHandler}>
          <div className="account-modal-body">
            {formError && (
              <div className="alert alert-warning mb-3">{formError}</div>
            )}

            {createError && (
              <div className="alert alert-danger mb-3">{createError}</div>
            )}

            <div className="account-form-section">
              <div className="account-form-grid">
                <div className="account-field">
                  <label
                    htmlFor="branch-manager-user-search"
                    className="form-label fw-semibold"
                  >
                    Search User
                  </label>

                  <div className="d-flex gap-2 flex-column flex-sm-row">
                    <input
                      id="branch-manager-user-search"
                      type="text"
                      className="form-control"
                      placeholder="Search by full name, username, or email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          searchHandler(e);
                        }
                      }}
                      disabled={createLoading}
                    />

                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={searchHandler}
                      disabled={searchLoading || createLoading}
                    >
                      {searchLoading ? "Searching..." : "Search"}
                    </button>
                  </div>

                  {searchError && (
                    <div className="alert alert-danger mt-2 mb-0">
                      {searchError}
                    </div>
                  )}
                </div>

                <div className="account-field">
                  <label
                    htmlFor="branch-manager-selected-user"
                    className="form-label fw-semibold"
                  >
                    Select User
                  </label>
                  <select
                    id="branch-manager-selected-user"
                    className="form-select"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    disabled={createLoading || searchLoading}
                  >
                    <option value="">Select user</option>
                    {(searchedUsers || []).map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.full_name || user.username || user.email}{" "}
                        {user.email ? `(${user.email})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="account-field">
                  <label
                    htmlFor="branch-manager-selected-branch"
                    className="form-label fw-semibold"
                  >
                    Branch
                  </label>
                  <select
                    id="branch-manager-selected-branch"
                    className="form-select"
                    value={selectedBranchId}
                    onChange={(e) => setSelectedBranchId(e.target.value)}
                    disabled={createLoading || branchesLoading}
                  >
                    <option value="">Select branch</option>
                    {managedBranches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>

                  {branchesError && (
                    <div className="alert alert-danger mt-2 mb-0">
                      {branchesError}
                    </div>
                  )}
                </div>

                <div className="account-field">
                  <label
                    htmlFor="branch-manager-create-role"
                    className="form-label fw-semibold"
                  >
                    Role
                  </label>
                  <select
                    id="branch-manager-create-role"
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={createLoading}
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
              disabled={createLoading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                createLoading || !selectedUserId || !selectedBranchId || !role
              }
            >
              {createLoading ? "Saving..." : "Add Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchManagerAssignmentCreateModal;
