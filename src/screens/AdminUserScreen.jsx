import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { listUsers } from "../actions/cookBatchActions";
import UserTable from "../components/accounts/UserTable";

const AdminUserScreen = () => {
  const dispatch = useDispatch();

  const userListState = useSelector((state) => state.userList);
  const { loading, error, users } = userListState;

  useEffect(() => {
    dispatch(listUsers());
  }, [dispatch]);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">User Management</h2>
      </div>

      {loading ? (
        <div className="alert alert-info">Loading users...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : users?.length === 0 ? (
        <div className="alert alert-warning">No users found.</div>
      ) : (
        <UserTable users={users} />
      )}
    </div>
  );
};

export default AdminUserScreen;
