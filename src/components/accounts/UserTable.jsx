import UserTableRow from "./UserTableRow";

const UserTable = ({ users }) => {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Global Role</th>
                <th>Active</th>
                <th>Branch Roles</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <UserTableRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
