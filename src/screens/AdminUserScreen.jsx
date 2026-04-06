import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  listUsers,
  getCurrentUser,
  listBranchManagerStaff,
  listBranchManagerBranches,
  deleteBranchManagerAssignment,
} from "../actions/cookBatchActions";
import UserTable from "../components/accounts/UserTable";
import BranchManagerTable from "../components/accounts/BranchManagerTable";

import "../styles/accounts.css";

const AdminUserScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userListState = useSelector((state) => state.userList);
  const { loading, error, users } = userListState;

  const userMe = useSelector((state) => state.userMe);
  const { user: currentUser } = userMe;

  const branchManagerStaffListState = useSelector(
    (state) => state.branchManagerStaffList,
  );
  const {
    loading: branchManagerLoading,
    error: branchManagerError,
    staff: branchManagerStaff,
  } = branchManagerStaffListState;

  const branchManagerAssignmentDeleteState = useSelector(
    (state) => state.branchManagerAssignmentDelete,
  );
  const { error: deleteError, success: deleteSuccess } =
    branchManagerAssignmentDeleteState;

  const isAdminUser =
    currentUser?.global_role === "boss" ||
    currentUser?.global_role === "managing_director";

  const isBranchManager =
    currentUser?.branch_roles?.some(
      (role) => role.role === "branch_manager" && role.is_active,
    ) || false;

  const pageLoading = isAdminUser ? loading : branchManagerLoading;
  const pageError = isAdminUser ? error : branchManagerError;
  const pageData = isAdminUser ? users : branchManagerStaff;

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser && isAdminUser) {
      dispatch(listUsers());
    }

    if (currentUser && !isAdminUser && isBranchManager) {
      dispatch(listBranchManagerStaff());
    }

    if (currentUser && !isAdminUser && !isBranchManager) {
      navigate("/cooking/batches");
    }
  }, [dispatch, currentUser, isAdminUser, isBranchManager, navigate]);

  useEffect(() => {
    if (deleteSuccess && isBranchManager) {
      dispatch(listBranchManagerStaff());
    }
  }, [dispatch, deleteSuccess, isBranchManager]);

  if (currentUser && !isAdminUser && !isBranchManager) {
    return null;
  }

  const handleBranchManagerEdit = (assignment) => {
    console.log("Edit assignment:", assignment);
  };

  const handleBranchManagerDelete = (assignment) => {
    if (!assignment?.assignment_id) return;

    const confirmed = window.confirm(
      `Remove ${assignment.full_name || "this staff member"} from ${assignment.branch_name}?`,
    );

    if (!confirmed) return;

    dispatch(deleteBranchManagerAssignment(assignment.assignment_id));
  };

  return (
    <div className="container account-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="account-page-title mb-0">
          {isAdminUser ? "User Management" : "Branch Staff Management"}
        </h2>
      </div>

      {deleteError && <div className="alert alert-danger">{deleteError}</div>}

      {pageLoading ? (
        <div className="alert alert-info">Loading...</div>
      ) : pageError ? (
        <div className="alert alert-danger">{pageError}</div>
      ) : pageData?.length === 0 ? (
        <div className="alert alert-warning">No records found.</div>
      ) : isAdminUser ? (
        <UserTable users={users} />
      ) : (
        <BranchManagerTable
          staff={branchManagerStaff}
          onEdit={handleBranchManagerEdit}
          onDelete={handleBranchManagerDelete}
        />
      )}
    </div>
  );
};

export default AdminUserScreen;
