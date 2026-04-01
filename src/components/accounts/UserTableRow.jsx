const UserTableRow = ({ user }) => {
  return (
    <tr>
      <td>{user.id}</td>
      <td>{user.full_name || "-"}</td>
      <td>{user.email || "-"}</td>
      <td>{user.username || "-"}</td>
      <td>{user.global_role || "none"}</td>
      <td>{user.is_active ? "Yes" : "No"}</td>
      <td>
        {user.branch_roles && user.branch_roles.length > 0 ? (
          <ul className="mb-0 ps-3">
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
    </tr>
  );
};

export default UserTableRow;
