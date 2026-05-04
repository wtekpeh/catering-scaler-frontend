const BranchRow = ({ branch, onEdit, onToggleStatus }) => {
  const isActive = branch.is_active;

  return (
    <tr>
      <td>
        <span className="account-user-name">{branch.name}</span>
      </td>

      <td>{branch.code || "-"}</td>

      <td>{branch.location || "-"}</td>

      <td>
        <span className={isActive ? "badge active" : "badge inactive"}>
          {isActive ? "Active" : "Inactive"}
        </span>
      </td>

      <td>
        <div className="d-flex justify-content-center gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-primary account-action-btn"
            onClick={() => onEdit(branch)}
          >
            Edit
          </button>

          <button
            type="button"
            className={`btn btn-sm ${
              isActive ? "btn-outline-danger" : "btn-outline-success"
            } account-action-btn`}
            onClick={() => onToggleStatus(branch)}
          >
            {isActive ? "Deactivate" : "Reactivate"}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BranchRow;
