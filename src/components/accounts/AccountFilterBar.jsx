const AccountFilterBar = ({
  isAdminUser,
  isBranchManager,
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  branchFilter,
  setBranchFilter,
  branches = [],
  onReset,
}) => {
  if (!isAdminUser && !isBranchManager) return null;

  return (
    <div className="account-form-section mb-4">
      <div className="account-form-grid">
        <div className="account-field">
          <label htmlFor="account-search" className="form-label fw-semibold">
            Search
          </label>
          <input
            id="account-search"
            type="text"
            className="form-control"
            placeholder={
              isAdminUser
                ? "Search by name, email, or username"
                : "Search branch staff by name, email, or username"
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="account-field">
          <label
            htmlFor="account-role-filter"
            className="form-label fw-semibold"
          >
            Role
          </label>
          <select
            id="account-role-filter"
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>

            {isAdminUser ? (
              <>
                <option value="boss">Boss</option>
                <option value="managing_director">Managing Director</option>
                <option value="branch_manager">Branch Manager</option>
                <option value="chef">Chef</option>
                <option value="kitchen_staff">Kitchen Staff</option>
                <option value="store">Store</option>
              </>
            ) : (
              <>
                <option value="chef">Chef</option>
                <option value="kitchen_staff">Kitchen Staff</option>
                <option value="store">Store</option>
              </>
            )}
          </select>
        </div>

        {isAdminUser && (
          <div className="account-field">
            <label
              htmlFor="account-branch-filter"
              className="form-label fw-semibold"
            >
              Branch
            </label>
            <select
              id="account-branch-filter"
              className="form-select"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
            >
              <option value="">All Branches</option>
              {(branches || []).map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="account-field d-flex align-items-end">
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={onReset}
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountFilterBar;
