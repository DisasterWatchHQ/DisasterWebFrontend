"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const NotificationContext = createContext();
const MAX_RETRIES = 5;
const MAX_NOTIFICATIONS = 50;
const CONNECTION_TIMEOUT = 600000; // 30 minutes
const THROTTLE_INTERVAL = 5000; // 1 second between messages

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [eventSource, setEventSource] = useState(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewNotification = useCallback(
    (notification) => {
      const now = Date.now();
      if (now - lastMessageTime < THROTTLE_INTERVAL) {
        return;
      }

      setLastMessageTime(now);
      setNotifications((prev) => {
        const newNotifications = [{ ...notification, isRead: false }, ...prev];
        return newNotifications.slice(0, MAX_NOTIFICATIONS);
      });

      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.description || notification.update_text,
          icon: "/icon.png",
          tag: notification.id,
        });
      }
    },
    [lastMessageTime],
  );

  const initializeSSE = useCallback(
    async (url) => {
      if (connectionAttempts >= MAX_RETRIES) {
        setError(new Error("Max reconnection attempts reached"));
        setIsConnected(false);
        return;
      }

      try {
        console.log("Initializing SSE connection to:", url); // Debug log
        const sse = new EventSource(url);

        sse.onopen = () => {
          console.log("SSE connection opened"); // Debug log
          setConnectionAttempts(0);
          setIsConnected(true);
          setIsSubscribed(true); // Make sure to set this
          setError(null);
        };

        sse.onmessage = (event) => {
          console.log("Received SSE message:", event.data); // Debug log
          try {
            const notification = JSON.parse(event.data);
            handleNewNotification(notification);
          } catch (error) {
            console.error("Error parsing SSE message:", error);
          }
        };

        sse.onerror = (error) => {
          console.error("SSE Error:", error); // More detailed error logging
          setIsConnected(false);
          sse.close();
          setConnectionAttempts((prev) => prev + 1);

          // Add delay before reconnection
          const reconnectDelay = Math.min(
            1000 * Math.pow(2, connectionAttempts),
            30000,
          );
          console.log(`Attempting to reconnect in ${reconnectDelay}ms`); // Debug log
          setTimeout(() => connectToSSE(), reconnectDelay);
        };

        setEventSource(sse);
      } catch (error) {
        console.error("Failed to initialize SSE:", error);
        setError(
          new Error(
            `Failed to initialize notification service: ${error.message}`,
          ),
        );
      }
    },
    [connectionAttempts, handleNewNotification],
  );
  const connectToSSE = useCallback(async () => {
    if (!("geolocation" in navigator)) {
      setHasLocationPermission(false);
      initializeSSE(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/subscribe`,
      );
      return;
    }

    try {
      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permissionStatus.state === "denied") {
        setHasLocationPermission(false);
        initializeSSE(
          `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/subscribe`,
        );
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setHasLocationPermission(true);
          const { latitude, longitude } = position.coords;
          const url = `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/subscribe?latitude=${latitude}&longitude=${longitude}`;
          initializeSSE(url);
        },
        (error) => {
          console.log("Location access error:", error.message);
          setHasLocationPermission(false);
          initializeSSE(
            `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/subscribe`,
          );
        },
        { timeout: 5000 },
      );
    } catch (error) {
      console.error("Error setting up notifications:", error);
      setHasLocationPermission(false);
      initializeSSE(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/subscribe`,
      );
    }
  }, [initializeSSE]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif,
      ),
    );
  }, []);

  const subscribe = useCallback(async (withLocation = false) => {
      console.log("Subscribe called with location:", withLocation); // Debug log
      
      // Close existing connection if any
      if (eventSource) {
        console.log("Closing existing connection"); // Debug log
        eventSource.close();
        setEventSource(null);
      }
  
      setIsSubscribed(true);
      
      if (withLocation) {
        await connectToSSE();
      } else {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/subscribe`;
        console.log("Subscribing to:", url); // Debug log
        initializeSSE(url);
      }
    }, [eventSource, connectToSSE, initializeSSE]);

  const unsubscribe = useCallback(() => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
    setIsSubscribed(false);
    setIsConnected(false);
  }, [eventSource]);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    connectToSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
        setIsConnected(false);
        setError(null);
        setConnectionAttempts(0);
      }
    };
  }, [connectToSSE, eventSource]);

  useEffect(() => {
     if ("Notification" in window) {
       Notification.requestPermission();
     }
 
     return () => {
       if (eventSource) {
         eventSource.close();
         setIsConnected(false);
         setError(null);
         setConnectionAttempts(0);
       }
     };
   }, [eventSource]);


  return (
    <NotificationContext.Provider
      value={{
        notifications,
        isConnected,
        isSubscribed,
        error,
        clearNotifications,
        markNotificationAsRead,
        hasLocationPermission,
        subscribe,
        unsubscribe,
        connectionAttempts,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}
