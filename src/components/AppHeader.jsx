import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import logo from "../assets/newco-logo.png";
import { keycloak } from "../auth/AuthProvider";
import { useNotificationStore } from "../stores/dashboard/useNotificationStore";
import { markNotificationAsRead } from "../api/notificationApi";
import "../styles/header.css";

function AppHeader() {
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [markingIds, setMarkingIds] = useState([]);

  const userMe = useSelector((state) => state.userMe);
  const { user: currentUser } = userMe;

  const items = useNotificationStore((state) => state.items);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const markAsReadLocal = useNotificationStore(
    (state) => state.markAsReadLocal,
  );

  const isAdminUser =
    currentUser?.global_role === "boss" ||
    currentUser?.global_role === "managing_director";

  const isBranchManager =
    currentUser?.branch_roles?.some(
      (role) => role.role === "branch_manager" && role.is_active,
    ) || false;

  const visibleNotifications = useMemo(
    () => items.filter((item) => !item.is_read).slice(0, 8),
    [items],
  );

  const toggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification) return;

    try {
      if (!notification.is_read && notification.id) {
        setMarkingIds((prev) => [...prev, notification.id]);
        await markNotificationAsRead(notification.id);
        markAsReadLocal(notification.id);
      }

      setIsNotificationOpen(false);

      if (notification.target_type === "cook_batch" && notification.target_id) {
        navigate(`/cooking/batches/${notification.target_id}`);
        return;
      }
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    } finally {
      if (notification.id) {
        setMarkingIds((prev) => prev.filter((id) => id !== notification.id));
      }
    }
  };

  const formatNotificationTime = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleString();
  };

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div
          className="app-logo"
          onClick={() => navigate("/cooking/batches")}
          title="NewCo Catering & Logistics"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate("/cooking/batches");
            }
          }}
        >
          <img src={logo} alt="NewCo Catering & Logistics Ltd" />
        </div>

        <div className="app-header__actions">
          {isAdminUser && (
            <button
              type="button"
              className="app-header__logout"
              onClick={() => navigate("/admin/users")}
            >
              Admin
            </button>
          )}

          {!isAdminUser && isBranchManager && (
            <button
              type="button"
              className="app-header__logout"
              onClick={() => navigate("/branch/staff")}
            >
              Staff
            </button>
          )}

          <div className="app-header__notifications">
            <button
              type="button"
              className="app-header__notification-button"
              onClick={toggleNotifications}
              aria-label="Open notifications"
            >
              <span className="app-header__notification-icon">🔔</span>

              {unreadCount > 0 && (
                <span className="app-header__notification-badge">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="app-header__notification-dropdown">
                <div className="app-header__notification-dropdown-header">
                  <span>Notifications</span>
                  <span className="app-header__notification-count">
                    {unreadCount} unread
                  </span>
                </div>

                {visibleNotifications.length === 0 ? (
                  <div className="app-header__notification-empty">
                    No notifications yet
                  </div>
                ) : (
                  <div className="app-header__notification-list">
                    {visibleNotifications.map((notification) => {
                      const isMarking = markingIds.includes(notification.id);

                      return (
                        <button
                          key={`${notification.id}-${notification.event_id}`}
                          type="button"
                          className={`app-header__notification-item ${
                            notification.is_read
                              ? "app-header__notification-item--read"
                              : "app-header__notification-item--unread"
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                          disabled={isMarking}
                        >
                          <div className="app-header__notification-message">
                            {notification.message}
                          </div>

                          <div className="app-header__notification-meta">
                            <span>{notification.action}</span>
                            <span>
                              {formatNotificationTime(notification.created_at)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="app-header__logout"
            onClick={() => keycloak.logout()}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
