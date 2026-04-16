import { create } from "zustand";

const initialState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

export const useNotificationStore = create((set) => ({
  ...initialState,

  setLoading: (loading) =>
    set(() => ({
      loading,
      error: null,
    })),

  setError: (error) =>
    set(() => ({
      error,
      loading: false,
    })),

  setNotifications: (items) =>
    set(() => ({
      items,
      loading: false,
      error: null,
    })),

  setUnreadCount: (count) =>
    set(() => ({
      unreadCount: count,
    })),

  prependNotification: (notification) =>
    set((state) => ({
      items: [notification, ...state.items],
      unreadCount: state.unreadCount + 1,
    })),

  markAsReadLocal: (id) =>
    set((state) => {
      const updated = state.items.map((item) =>
        item.id === id ? { ...item, is_read: true } : item,
      );

      return {
        items: updated,
        unreadCount: Math.max(state.unreadCount - 1, 0),
      };
    }),

  markAllAsReadLocal: () =>
    set((state) => ({
      items: state.items.map((item) => ({
        ...item,
        is_read: true,
      })),
      unreadCount: 0,
    })),

  resetNotifications: () =>
    set(() => ({
      ...initialState,
    })),
}));
