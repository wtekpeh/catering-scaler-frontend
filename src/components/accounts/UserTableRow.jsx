const formatRoleLabel = (role = "") => {
  const roleMap = {
    branch_manager: "site_manager",
  };

  return roleMap[role] || role;
};

const UserTableRow = ({ user, onEdit }) => {
  return (
    <tr>
      <td>{user.id}</td>
      <td className="account-user-name">{user.full_name || "-"}</td>
      <td>{user.email || "-"}</td>
      <td>{user.username || "-"}</td>
      <td>{user.global_role || "none"}</td>
      <td>{user.is_active ? "Yes" : "No"}</td>
      <td>
        {user.branch_roles && user.branch_roles.length > 0 ? (
          <ul className="account-role-list" style={{ marginBottom: 0 }}>
            {user.branch_roles.map((branchRole) => (
              <li key={branchRole.id}>
                {branchRole.branch_name} — {formatRoleLabel(branchRole.role)}
              </li>
            ))}
          </ul>
        ) : (
          "-"
        )}
      </td>
      <td className="text-center">
        <button
          type="button"
          className="btn btn-sm btn-outline-primary account-action-btn"
          style={{ minWidth: 90 }}
          onClick={() => onEdit(user)}
        >
          Edit Roles
        </button>
      </td>
    </tr>
  );
};

export default UserTableRow;
