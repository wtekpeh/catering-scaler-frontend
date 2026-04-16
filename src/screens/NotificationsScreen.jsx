import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "../stores/dashboard/useNotificationStore";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../api/notificationApi";

function NotificationsScreen() {
  const navigate = useNavigate();
  const [markingIds, setMarkingIds] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const items = useNotificationStore((state) => state.items);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications,
  );
  const markAsReadLocal = useNotificationStore(
    (state) => state.markAsReadLocal,
  );

  const markAllAsReadLocal = useNotificationStore(
    (state) => state.markAllAsReadLocal,
  );

  useEffect(() => {
    const loadAllNotificationsForPage = async () => {
      try {
        setPageLoading(true);
        const response = await getNotifications(200);
        setNotifications(response.items);
      } catch (error) {
        console.error("Failed to load notifications page data", error);
      } finally {
        setPageLoading(false);
      }
    };

    loadAllNotificationsForPage();
  }, [setNotifications]);

  const sortedItems = useMemo(() => {
    return [...items].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [items]);

  const handleNotificationClick = async (notification) => {
    if (!notification) return;

    try {
      if (!notification.is_read && notification.id) {
        setMarkingIds((prev) => [...prev, notification.id]);
        await markNotificationAsRead(notification.id);
        markAsReadLocal(notification.id);
      }

      if (notification.target_type === "cook_batch" && notification.target_id) {
        navigate(`/cooking/batches/${notification.target_id}`);
      }
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    } finally {
      if (notification.id) {
        setMarkingIds((prev) => prev.filter((id) => id !== notification.id));
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      await markAllNotificationsAsRead();
      markAllAsReadLocal();
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    } finally {
      setMarkingAll(false);
    }
  };

  const formatNotificationTime = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString();
  };

  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-page-header">
          <div>
            <h1 className="dashboard-page-title">Notifications</h1>
            <p className="dashboard-page-subtitle">
              {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
            </p>
          </div>

          <div>
            <button
              type="button"
              className="notification-page-mark-all"
              onClick={handleMarkAllAsRead}
              disabled={markingAll || unreadCount === 0}
            >
              {markingAll ? "Marking..." : "Mark all as read"}
            </button>
          </div>
        </div>

        {pageLoading ? (
          <div className="card">
            <div className="card-body">Loading notifications...</div>
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="card">
            <div className="card-body">No notifications yet.</div>
          </div>
        ) : (
          <div className="card">
            <div className="card-body">
              <div className="notification-page-list">
                {sortedItems.map((notification) => {
                  const isMarking = markingIds.includes(notification.id);

                  return (
                    <button
                      key={`${notification.id}-${notification.event_id}`}
                      type="button"
                      className={`notification-page-item ${
                        notification.is_read
                          ? "notification-page-item--read"
                          : "notification-page-item--unread"
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                      disabled={isMarking}
                    >
                      <div className="notification-page-item__message">
                        {notification.message}
                      </div>

                      <div className="notification-page-item__meta">
                        <span>{notification.action}</span>
                        <span>
                          {formatNotificationTime(notification.created_at)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsScreen;
