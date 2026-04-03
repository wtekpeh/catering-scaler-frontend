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
          <ul className="account-role-list">
            {user.branch_roles.map((branchRole) => (
              <li key={branchRole.id}>
                {branchRole.branch_name} — {branchRole.role}
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
          onClick={() => onEdit(user)}
        >
          Edit
        </button>
      </td>
    </tr>
  );
};

export default UserTableRow;
