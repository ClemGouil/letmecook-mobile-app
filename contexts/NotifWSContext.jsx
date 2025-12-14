import { createContext, useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "../hooks/useUser";
import { Client } from "@stomp/stompjs";

export const NotifWSContext = createContext();

export function NotifWSProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const { user, token } = useUser();
  const stompRef = useRef(null);

  const WS_URL = `http://192.168.1.13:8080/ws`;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  useEffect(() => {
    if (!user || !token) return;

    const client = new Client({
      brokerURL: WS_URL,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log("STOMP connecté");

        client.subscribe(`/user/${user.id}/notification`, (message) => {
          const notif = JSON.parse(message.body);
          setNotifications(prev => [notif, ...prev]);
        });
      },
      onStompError: (err) => {
        console.error("Erreur STOMP:", err);
      },
      debug: (str) => console.log(str),
    });

    client.activate();
    stompRef.current = client;

    return () => {
      if (stompRef.current) {
        stompRef.current.deactivate();
      }
    };
  }, [user, token]);

  return (
    <NotifWSContext.Provider
      value={{ notifications, unreadCount, markAsRead }}
    >
      {children}
    </NotifWSContext.Provider>
  );
}