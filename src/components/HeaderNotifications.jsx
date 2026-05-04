import React from "react";

function HeaderNotifications({
  isOpen,
  unreadCount,
  visibleNotifications,
  markAllAsRead,
  onToggle,
  onNotificationClick,
  onViewAll,
  formatNotificationTime,
}) {
  const formatNotificationText = (value = "") => {
    return value
      .replaceAll("Cook Batch", "Consumption")
      .replaceAll("cook batch", "consumption")
      .replaceAll("Cook batch", "Consumption")
      .replaceAll("cook Batch", "consumption")
      .replaceAll("COOK_BATCH", "CONSUMPTION")
      .replaceAll("cook_batch", "consumption");
  };

  return (
    <div className="app-header__notifications">
      <button
        type="button"
        className="app-header__notification-button"
        onClick={onToggle}
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <span className="app-header__notification-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="app-header__notification-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="app-header__notification-backdrop"
            aria-label="Close notifications"
            onClick={onToggle}
          />
          <div className="app-header__notification-dropdown">
            <div className="app-header__notification-dropdown-header">
              <div className="app-header__notification-dropdown-title">
                <span>Notifications</span>
                <span className="app-header__notification-count">
                  {unreadCount} unread
                </span>
              </div>

              <button
                type="button"
                className="app-header__notification-mark-all"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark all
              </button>
            </div>

            <div className="app-header__notification-list">
              {visibleNotifications.length === 0 ? (
                <div className="app-header__notification-empty">
                  No notifications yet
                </div>
              ) : (
                visibleNotifications.slice(0, 6).map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    className={`app-header__notification-item ${
                      notification.is_read
                        ? "app-header__notification-item--read"
                        : "app-header__notification-item--unread"
                    }`}
                    onClick={() => onNotificationClick(notification)}
                  >
                    <div className="app-header__notification-message">
                      {formatNotificationText(notification.message)}
                    </div>
                    <div className="app-header__notification-meta">
                      <span>{notification.event_type}</span>
                      <span>
                        {formatNotificationTime(notification.created_at)}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="app-header__notification-footer">
              <button
                type="button"
                className="app-header__notification-view-all"
                onClick={onViewAll}
              >
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default HeaderNotifications;
