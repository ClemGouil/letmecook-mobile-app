import { createContext, useState, useEffect } from "react";
import { api } from "../api/axiosInstance";
import { useUser } from "../hooks/useUser";

export const NotifContext  = createContext();

export function NotifProvider ({ children }) {

  const [notifications, setNotifications] = useState([]);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadUnreadNotification(user.id);
    }
  }, [user]);

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