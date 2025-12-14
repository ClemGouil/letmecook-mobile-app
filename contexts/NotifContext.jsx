import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../hooks/useUser";

export const NotifContext  = createContext();

export function NotifProvider ({ children }) {

  const [notifications, setNotifications] = useState([]);

  const { user, token } = useUser();

  useEffect(() => {
    if (user) {
      loadUnreadNotification(user.id);
    }
  }, [user]);

  const API_URL = `${process.env.EXPO_PUBLIC_URL_BACKEND}/api`;

  async function loadUnreadNotification(userId) {
    try {
      const response = await axios.get(`${API_URL}/notifications/unread`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: {userId},
      });
      setNotifications(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des notifs: ", err);
    }
  }

  async function markAsRead(id) {
    try {
      await axios.put(`${API_URL}/notifications/${id}/read`, {} , {
        headers: { Authorization: `Bearer ${token}` },
      });
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