import React from "react";

function MobileHeaderMenu({
  isOpen,
  navItems,
  isActivePath,
  onNavigate,
  isAdminUser,
  isBranchManager,
  onLogout,
}) {
  if (!isOpen) return null;

  return (
    <div className="app-header__mobile-panel">
      <div className="app-header__mobile-nav">
        {navItems.map((item) => (
          <button
            key={item.path}
            type="button"
            className={`app-header__mobile-link ${
              isActivePath(item.path) ? "app-header__mobile-link--active" : ""
            }`}
            onClick={() => onNavigate(item.path)}
          >
            {item.label}
          </button>
        ))}

        {isAdminUser && (
          <button
            type="button"
            className="app-header__mobile-link"
            onClick={() => onNavigate("/admin/users")}
          >
            Admin
          </button>
        )}

        {!isAdminUser && isBranchManager && (
          <button
            type="button"
            className="app-header__mobile-link"
            onClick={() => onNavigate("/branch/staff")}
          >
            Staff
          </button>
        )}

        <button
          type="button"
          className="app-header__mobile-link app-header__mobile-link--danger"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default MobileHeaderMenu;
