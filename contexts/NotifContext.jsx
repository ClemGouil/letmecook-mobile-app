import { createContext, useState, useEffect, useRef } from "react";
import { api } from "../api/axiosInstance";
import { useUser } from "../hooks/useUser";

export const NotifContext  = createContext();

export function NotifProvider ({ children }) {

  const [notifications, setNotifications] = useState([]);
  const { user, accessToken } = useUser();
  const wsRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadUnreadNotification(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.id || !accessToken) return;

    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(
      `${process.env.EXPO_PUBLIC_WS_URL}/ws?token=${accessToken}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connecté");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        setNotifications(prev => {
          const exists = prev.find(n => n.id === data.id);
          if (exists) return prev;

          return [data, ...prev];
        });
      } catch (e) {
        console.log("Erreur parsing WS :", e);
      }
    };

    ws.onerror = (err) => {
      console.log("WS error :", err.message);
    };

    ws.onclose = () => {
      console.log("WS fermé");
    };

    return () => {
      console.log("Cleanup WS");
      ws.close();
    };
  }, [user?.id, accessToken]);

  async function loadUnreadNotification(userId) {
    try {
      const response = await api.get(`/notifications/unread`, {
        params: {userId},
      });
      setNotifications(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des notifs: ", err);
    }
  }

  async function markAsRead(id) {
    try {
      await api.put(`/notifications/${id}/read`, {});
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  return (
    <NotifContext.Provider
      value={{
        notifications,
        loadUnreadNotification,
        unreadCount: notifications.filter((n) => !n.read).length,
        markAsRead
      }}
    >
      {children}
    </NotifContext.Provider>
  );
}