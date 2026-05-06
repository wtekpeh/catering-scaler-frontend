import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import logo from "../assets/newco-logo.png";
import { keycloak } from "../auth/AuthProvider";
import { useNotificationStore } from "../stores/dashboard/useNotificationStore";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../api/notificationApi";
import "../styles/header.css";
import HeaderNav from "./HeaderNav";
import MobileHeaderMenu from "./MobileHeaderMenu";
import HeaderNotifications from "./HeaderNotifications";
import MobileHeaderControls from "./MobileHeaderControls";

function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [markingIds, setMarkingIds] = useState([]);
  const [markingAll, setMarkingAll] = useState(false);

  const userMe = useSelector((state) => state.userMe);
  const { user: currentUser } = userMe;

  const items = useNotificationStore((state) => state.items);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const markAsReadLocal = useNotificationStore(
    (state) => state.markAsReadLocal,
  );

  const markAllAsReadLocal = useNotificationStore(
    (state) => state.markAllAsReadLocal,
  );

  const isAdminUser =
    currentUser?.global_role === "boss" ||
    currentUser?.global_role === "managing_director";

  const isBranchManager =
    currentUser?.branch_roles?.some(
      (role) => role.role === "branch_manager" && role.is_active,
    ) || false;

  const navItems = [
    ...(isAdminUser ? [{ label: "Dashboard", path: "/dashboard" }] : []),

    ...(!isAdminUser && isBranchManager
      ? [{ label: "Site Dashboard", path: "/branch-dashboard" }]
      : []),

    { label: "Cooking", path: "/cooking/batches" },

    ...(isAdminUser ? [{ label: "Recipes", path: "/recipes" }] : []),

    { label: "Notifications", path: "/notifications" },
  ];

  const isActivePath = (path) => {
    if (path === "/cooking/batches") {
      return location.pathname.startsWith("/cooking/batches");
    }

    if (path === "/recipes") {
      return location.pathname.startsWith("/recipes");
    }

    return location.pathname === path;
  };

  const visibleNotifications = useMemo(
    () => items.filter((item) => !item.is_read).slice(0, 8),
    [items],
  );

  const toggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  const handleNavigate = (path) => {
    setIsMobileMenuOpen(false);
    setIsNotificationOpen(false);
    navigate(path);
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

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsNotificationOpen(false);
  }, [location.pathname]);

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

        <HeaderNav
          navItems={navItems}
          isActivePath={isActivePath}
          onNavigate={navigate}
        />

        <MobileHeaderControls
          isNotificationOpen={isNotificationOpen}
          unreadCount={unreadCount}
          visibleNotifications={visibleNotifications}
          markingAll={markingAll}
          markAllAsRead={handleMarkAllAsRead}
          onToggleNotifications={() => {
            setIsNotificationOpen((prev) => !prev);
            setIsMobileMenuOpen(false);
          }}
          onNotificationClick={handleNotificationClick}
          onViewAll={() => {
            setIsNotificationOpen(false);
            navigate("/notifications");
          }}
          formatNotificationTime={formatNotificationTime}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMenu={() => {
            setIsMobileMenuOpen((prev) => !prev);
            setIsNotificationOpen(false);
          }}
        />

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

          <HeaderNotifications
            isOpen={isNotificationOpen}
            unreadCount={unreadCount}
            visibleNotifications={visibleNotifications} // ✅ THIS
            markAllAsRead={handleMarkAllAsRead}
            onToggle={toggleNotifications}
            onNotificationClick={handleNotificationClick}
            onViewAll={() => {
              setIsNotificationOpen(false);
              navigate("/notifications");
            }}
            formatNotificationTime={formatNotificationTime}
          />

          <button
            type="button"
            className="app-header__logout"
            onClick={() => keycloak.logout()}
          >
            Logout
          </button>
        </div>
      </div>

      <MobileHeaderMenu
        isOpen={isMobileMenuOpen}
        navItems={navItems}
        isActivePath={isActivePath}
        onNavigate={handleNavigate}
        isAdminUser={isAdminUser}
        isBranchManager={isBranchManager}
        onLogout={() => {
          setIsMobileMenuOpen(false);
          keycloak.logout();
        }}
      />
    </header>
  );
}

export default AppHeader;
