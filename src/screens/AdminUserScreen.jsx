import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  listUsers,
  getCurrentUser,
  listBranchManagerStaff,
  deleteBranchManagerAssignment,
  listBranches,
} from "../actions/cookBatchActions";
import UserTable from "../components/accounts/UserTable";
import BranchManagerTable from "../components/accounts/BranchManagerTable";
import BranchManagerAssignmentEditModal from "../components/accounts/BranchManagerAssignmentEditModal";
import BranchManagerAssignmentCreateModal from "../components/accounts/BranchManagerAssignmentCreateModal";
import AccountFilterBar from "../components/accounts/AccountFilterBar";
import AccountPagination from "../components/accounts/AccountPagination";

import "../styles/accounts.css";

const AdminUserScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const userListState = useSelector((state) => state.userList);
  const { loading, error, users, count: userCount } = userListState;

  const userMe = useSelector((state) => state.userMe);
  const { user: currentUser } = userMe;

  const branchListState = useSelector((state) => state.branchList);
  const { branches } = branchListState;

  const branchManagerStaffListState = useSelector(
    (state) => state.branchManagerStaffList,
  );

  const {
    loading: branchManagerLoading,
    error: branchManagerError,
    staff: branchManagerStaff,
    count: branchManagerCount,
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
  const totalCount = isAdminUser ? userCount : branchManagerCount;

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, roleFilter, branchFilter]);

  useEffect(() => {
    if (currentUser && isAdminUser) {
      dispatch(
        listUsers({
          search: debouncedSearch,
          role: roleFilter,
          branch: branchFilter,
          page: currentPage,
        }),
      );
      dispatch(listBranches());
    }

    if (currentUser && !isAdminUser && isBranchManager) {
      dispatch(
        listBranchManagerStaff({
          search: debouncedSearch,
          role: roleFilter,
          page: currentPage,
        }),
      );
    }

    if (currentUser && !isAdminUser && !isBranchManager) {
      navigate("/cooking/batches");
    }
  }, [
    dispatch,
    currentUser,
    isAdminUser,
    isBranchManager,
    navigate,
    debouncedSearch,
    roleFilter,
    branchFilter,
    currentPage,
  ]);

  useEffect(() => {
    if (deleteSuccess && isBranchManager) {
      dispatch(
        listBranchManagerStaff({
          search: debouncedSearch,
          role: roleFilter,
          page: currentPage,
        }),
      );
    }
  }, [
    dispatch,
    deleteSuccess,
    isBranchManager,
    debouncedSearch,
    roleFilter,
    currentPage,
  ]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil((totalCount || 0) / 10));

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalCount]);

  if (currentUser && !isAdminUser) {
    return (
      <div className="container account-page">
        <div className="alert alert-danger">
          You are not authorized to access User Management.
        </div>
      </div>
    );
  }

  const closeEditModalHandler = () => {
    setShowEditModal(false);
    setSelectedAssignment(null);
  };

  const openCreateModalHandler = () => {
    setShowCreateModal(true);
  };

  const closeCreateModalHandler = () => {
    setShowCreateModal(false);
  };

  const handleEditSuccess = () => {
    dispatch(
      listBranchManagerStaff({
        search: debouncedSearch,
        role: roleFilter,
        page: currentPage,
      }),
    );
  };

  const handleCreateSuccess = () => {
    dispatch(
      listBranchManagerStaff({
        search: debouncedSearch,
        role: roleFilter,
        page: currentPage,
      }),
    );
  };

  const handleResetFilters = () => {
    setSearch("");
    setRoleFilter("");
    setBranchFilter("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
      <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap mb-4">
        <h2 className="account-page-title mb-0">
          {isAdminUser ? "User Management" : "Site Staff Management"}
        </h2>

        <div className="d-flex gap-2 flex-wrap">
          {isAdminUser && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/admin/branches")}
            >
              Manage Sites
            </button>
          )}

          {!isAdminUser && isBranchManager && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={openCreateModalHandler}
            >
              Add Staff
            </button>
          )}
        </div>
      </div>

      {deleteError && <div className="alert alert-danger">{deleteError}</div>}

      <AccountFilterBar
        isAdminUser={isAdminUser}
        isBranchManager={isBranchManager}
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        branchFilter={branchFilter}
        setBranchFilter={setBranchFilter}
        branches={branches}
        onReset={handleResetFilters}
      />

      <BranchManagerAssignmentEditModal
        show={showEditModal}
        assignment={selectedAssignment}
        onClose={closeEditModalHandler}
        onSuccess={handleEditSuccess}
      />

      <BranchManagerAssignmentCreateModal
        show={showCreateModal}
        onClose={closeCreateModalHandler}
        onSuccess={handleCreateSuccess}
      />

      {pageLoading ? (
        <div className="alert alert-info">Loading...</div>
      ) : pageError ? (
        <div className="alert alert-danger">{pageError}</div>
      ) : pageData?.length === 0 ? (
        <div className="alert alert-warning">No records found.</div>
      ) : (
        <>
          <UserTable users={users} />

          <AccountPagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={10}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default AdminUserScreen;
