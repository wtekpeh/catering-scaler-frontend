// src/components/accounts/branches/BranchList.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listBranches,
  updateBranchStatus,
} from "../../../actions/cookBatchActions";
import ConfirmActionModal from "../../common/ConfirmActionModal";
import BranchForm from "./BranchForm";
import BranchRow from "./BranchRow";

const BranchList = () => {
  const dispatch = useDispatch();

  const { loading, branches, error } = useSelector((state) => state.branchList);
  const { success: deleteSuccess } = useSelector((state) => state.branchDelete);

  const [showForm, setShowForm] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(null);
  const [confirmBranch, setConfirmBranch] = useState(null);

  useEffect(() => {
    dispatch(listBranches());
  }, [dispatch, deleteSuccess]);

  useEffect(() => {
    if (deleteSuccess) {
      setMessage("Branch deactivated successfully");

      setTimeout(() => {
        setMessage(null);
      }, 2500);
    }
  }, [deleteSuccess]);

  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedBranch(null);
    setShowForm(true);
  };

  const handleToggleStatus = (branch) => {
    setConfirmBranch(branch);
  };

  const handleConfirmToggleStatus = () => {
    if (!confirmBranch) return;

    dispatch(updateBranchStatus(confirmBranch.id, !confirmBranch.is_active));
    setConfirmBranch(null);
  };

  const filteredBranches = branches.filter((branch) => {
    const text = `${branch.name || ""} ${branch.code || ""} ${
      branch.location || ""
    }`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div className="container account-page px-3">
      <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap mb-4 pb-2">
        <div>
          <h2 className="account-page-title mb-0">Branch Management</h2>
          <small className="text-muted">
            {filteredBranches.length} branch
            {filteredBranches.length !== 1 ? "es" : ""}
          </small>
        </div>

        {message && <div className="alert alert-success mb-3">{message}</div>}

        <div className="mb-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCreate}
          >
            + Create Site
          </button>
        </div>
      </div>

      <div className="account-form-section mb-4">
        <div className="account-form-grid">
          <div className="account-field">
            <label htmlFor="branch-search" className="form-label fw-semibold">
              Search
            </label>
            <input
              id="branch-search"
              type="text"
              className="form-control"
              placeholder="Search by name, code, or location"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="account-field d-flex align-items-end">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={() => setSearch("")}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="alert alert-info">Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filteredBranches.length === 0 ? (
        <div className="text-center py-4 account-empty-text">
          No sites found.
        </div>
      ) : (
        <div className="account-card">
          <div className="card-body py-4 px-3">
            <div className="desktop-only">
              <div className="table-responsive">
                <table className="table table-hover align-middle account-table">
                  <thead className="bg-light">
                    <tr>
                      <th>Name</th>
                      <th>Code</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBranches.map((branch) => (
                      <BranchRow
                        key={branch.id}
                        branch={branch}
                        onEdit={handleEdit}
                        onToggleStatus={handleToggleStatus}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mobile-only">
              <div className="user-cards">
                {filteredBranches.map((branch) => (
                  <div key={branch.id} className="user-card">
                    <div className="user-card__top">
                      <div className="user-card__name">{branch.name}</div>

                      <div className="user-card__role">
                        {branch.is_active ? "Active" : "Inactive"}
                      </div>
                    </div>

                    <div className="user-card__meta">
                      <div>
                        <strong>Code:</strong> {branch.code || "-"}
                      </div>
                      <div>
                        <strong>Location:</strong> {branch.location || "-"}
                      </div>
                    </div>

                    <div className="user-card__actions">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => handleEdit(branch)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className={
                          branch.is_active
                            ? "btn btn-outline-danger"
                            : "btn btn-outline-success"
                        }
                        onClick={() => handleToggleStatus(branch)}
                      >
                        {branch.is_active ? "Deactivate" : "Reactivate"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <BranchForm
          branch={selectedBranch}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default BranchList;
