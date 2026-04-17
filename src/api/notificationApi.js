import axios from "./axiosInstance";

const API_BASE = import.meta.env.VITE_GO_API_BASE_URL;

export const getNotifications = async (limit = 20) => {
  const { data } = await axios.get(`${API_BASE}/notifications`, {
    params: { limit },
  });

  return {
    items: data.items || [],
  };
};

export const getUnreadCount = async () => {
  const { data } = await axios.get(`${API_BASE}/notifications/unread-count`);

  return {
    unreadCount: data.unread_count ?? 0,
  };
};

export const markNotificationAsRead = async (id) => {
  await axios.patch(`${API_BASE}/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = async () => {
  await axios.patch(`${API_BASE}/notifications/read-all`);
};
