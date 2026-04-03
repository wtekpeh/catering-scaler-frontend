import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import UserTableRow from "./UserTableRow";
import UserRoleModal from "./UserRoleModal";

import { listUsers, updateUserRoles } from "../../actions/cookBatchActions";
import { USER_ROLE_UPDATE_RESET } from "../../constants/cookBatchConstants";

const UserTable = ({ users }) => {
  const dispatch = useDispatch();

  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const userRoleUpdateState = useSelector((state) => state.userRoleUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userRoleUpdateState;

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const handleCloseModal = () => {
    setShowRoleModal(false);
    setSelectedUser(null);
  };

  const handleSave = (payload) => {
    if (!selectedUser?.id) return;
    dispatch(updateUserRoles(selectedUser.id, payload));
  };

  useEffect(() => {
    if (successUpdate) {
      dispatch(listUsers());
      dispatch({ type: USER_ROLE_UPDATE_RESET });
      handleCloseModal();
    }
  }, [dispatch, successUpdate]);

  return (
    <>
      <div className="account-card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle account-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Global Role</th>
                  <th>Active</th>
                  <th>Branch Roles</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <UserTableRow key={user.id} user={user} onEdit={handleEdit} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <UserRoleModal
        show={showRoleModal}
        user={selectedUser}
        onClose={handleCloseModal}
        onSave={handleSave}
        loading={loadingUpdate}
        error={errorUpdate}
      />
    </>
  );
};

export default UserTable;
