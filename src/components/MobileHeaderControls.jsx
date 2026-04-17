import React from "react";
import HeaderNotifications from "./HeaderNotifications";

function MobileHeaderControls({
  isNotificationOpen,
  unreadCount,
  visibleNotifications,
  markingAll,
  markAllAsRead,
  onToggleNotifications,
  onNotificationClick,
  onViewAll,
  formatNotificationTime,
  isMobileMenuOpen,
  onToggleMenu,
}) {
  return (
    <div className="app-header__mobile-controls">
      <HeaderNotifications
        isOpen={isNotificationOpen}
        unreadCount={unreadCount}
        visibleNotifications={visibleNotifications}
        markingAll={markingAll}
        markAllAsRead={markAllAsRead}
        onToggle={onToggleNotifications}
        onNotificationClick={onNotificationClick}
        onViewAll={onViewAll}
        formatNotificationTime={formatNotificationTime}
      />

      <button
        type="button"
        className="app-header__menu-toggle"
        aria-label="Open menu"
        aria-expanded={isMobileMenuOpen}
        onClick={onToggleMenu}
      >
        ☰
      </button>
    </div>
  );
}

export default MobileHeaderControls;
