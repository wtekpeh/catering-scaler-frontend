import React from "react";

const BranchManagerTable = ({ staff, onEdit, onDelete }) => {
  return (
    <div className="account-card">
      <div className="card-body">
        {/* DESKTOP TABLE */}
        <div className="desktop-only">
          <div className="table-responsive">
            <table className="table table-hover align-middle account-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Site</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {staff.map((item) => (
                  <tr key={item.assignment_id}>
                    <td>{item.assignment_id}</td>
                    <td className="account-user-name">
                      {item.full_name || "-"}
                    </td>
                    <td>{item.email || "-"}</td>
                    <td>{item.username || "-"}</td>
                    <td>{item.branch_name}</td>
                    <td>{item.role}</td>
                    <td>
                      {item.staff_profile_is_active ? "Active" : "Inactive"}
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary account-action-btn me-2"
                        style={{ minWidth: 80 }}
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger account-action-btn"
                        style={{ minWidth: 80 }}
                        onClick={() => onDelete(item)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MOBILE CARDS */}
        <div className="mobile-only">
          <div className="user-cards">
            {staff.map((item) => (
              <div key={item.assignment_id} className="user-card">
                <div className="user-card__top">
                  <div className="user-card__name">
                    {item.full_name || "No Name"}
                  </div>
                  <div className="user-card__role">{item.role}</div>
                </div>

                <div className="user-card__meta">
                  <div>
                    <b>Email:</b> {item.email}
                  </div>
                  <div>
                    <b>Username:</b> {item.username}
                  </div>
                  <div>
                    <b>Site:</b> {item.branch_name}
                  </div>
                  <div>
                    <b>Status:</b>{" "}
                    {item.staff_profile_is_active ? "Active" : "Inactive"}
                  </div>
                </div>
                <div className="user-card__actions">
                  <button type="button" onClick={() => onEdit(item)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => onDelete(item)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchManagerTable;
