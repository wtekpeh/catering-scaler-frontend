const BranchRoleEditor = ({ branchRoles, branches, onChange }) => {
  const handleAddRole = () => {
    onChange([
      ...branchRoles,
      {
        branch_id: "",
        role: "chef",
        is_active: true,
      },
    ]);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedRoles = branchRoles.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );

    onChange(updatedRoles);
  };

  const handleRemoveRole = (index) => {
    const updatedRoles = branchRoles.filter((_, i) => i !== index);
    onChange(updatedRoles);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="account-section-title mb-0">Branch Roles</div>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={handleAddRole}
        >
          Add Role
        </button>
      </div>

      {branchRoles.length === 0 ? (
        <div className="account-branch-box account-empty-text">
          No branch roles assigned yet.
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {branchRoles.map((item, index) => (
            <div key={index} className="account-branch-box">
              <div className="branch-role-row">
                <div className="branch-role-fields">
                  <div className="branch-role-field">
                    <label className="form-label fw-semibold">Branch</label>
                    <select
                      className="form-select"
                      value={item.branch_id}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "branch_id",
                          Number(e.target.value),
                        )
                      }
                    >
                      <option value="">Select branch</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="branch-role-field">
                    <label className="form-label fw-semibold">Role</label>
                    <select
                      className="form-select"
                      value={item.role}
                      onChange={(e) =>
                        handleFieldChange(index, "role", e.target.value)
                      }
                    >
                      <option value="">Select role</option>
                      <option value="branch_manager">Branch Manager</option>
                      <option value="chef">Chef</option>
                      <option value="kitchen_staff">Kitchen Staff</option>
                      <option value="store">Store</option>
                    </select>
                  </div>

                  <div className="branch-role-field branch-role-active">
                    <label className="form-label fw-semibold">Status</label>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`branch-role-active-${index}`}
                        checked={Boolean(item.is_active)}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            "is_active",
                            e.target.checked,
                          )
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`branch-role-active-${index}`}
                      >
                        Active
                      </label>
                    </div>
                  </div>
                </div>

                <div className="branch-role-remove">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemoveRole(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BranchRoleEditor;
