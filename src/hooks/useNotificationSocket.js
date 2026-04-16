import { useEffect } from "react";
import keycloak from "../auth/keycloak";
import { useNotificationStore } from "../stores/dashboard/useNotificationStore";
import notificationSound from "../assets/mixkit-digital-quick-tone-2866.wav";

export default function useNotificationSocket() {
  const prependNotification = useNotificationStore(
    (s) => s.prependNotification,
  );

  useEffect(() => {
    if (!keycloak.token) return;

    const audio = new Audio(notificationSound);
    audio.preload = "auto";

    const ws = new WebSocket(
      `ws://localhost:8081/ws/notifications?token=${keycloak.token}`,
    );

    ws.onopen = () => {
      console.log("[notifications] socket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "notification") {
          prependNotification({
            id: data.notification_id,
            event_id: data.event_id,
            action: data.action,
            target_type: data.target_type,
            target_id: data.target_id,
            message: data.message,
            branch_id: data.branch_id,
            is_read: false,
            created_at: data.created_at,
          });

          audio.currentTime = 0;
          audio.play().catch((err) => {
            console.warn("[notifications] sound play blocked", err);
          });
        }
      } catch (err) {
        console.error("socket parse error", err);
      }
    };

    ws.onclose = () => {
      console.log("[notifications] socket closed");
    };

    ws.onerror = (err) => {
      console.error("[notifications] socket error", err);
    };

    return () => {
      ws.close();
    };
  }, [prependNotification]);
}
