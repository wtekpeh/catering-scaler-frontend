import React from "react";

function HeaderNav({ navItems, isActivePath, onNavigate }) {
  return (
    <nav className="app-header__nav" aria-label="Primary navigation">
      {navItems.map((item) => (
        <button
          key={item.path}
          type="button"
          className={`app-header__nav-link ${
            isActivePath(item.path) ? "app-header__nav-link--active" : ""
          }`}
          onClick={() => onNavigate(item.path)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

export default HeaderNav;
