import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { listUsers, getCurrentUser } from "../actions/cookBatchActions";
import UserTable from "../components/accounts/UserTable";

import "../styles/accounts.css";

const AdminUserScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userListState = useSelector((state) => state.userList);
  const { loading, error, users } = userListState;

  const userMe = useSelector((state) => state.userMe);
  const { user: currentUser } = userMe;

  const isAdminUser =
    currentUser?.global_role === "boss" ||
    currentUser?.global_role === "managing_director";

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser && isAdminUser) {
      dispatch(listUsers());
    }

    if (currentUser && !isAdminUser) {
      navigate("/cooking/batches");
    }
  }, [dispatch, currentUser, isAdminUser, navigate]);

  if (currentUser && !isAdminUser) {
    return null;
  }

  return (
    <div className="container account-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="account-page-title mb-0">User Management</h2>
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
