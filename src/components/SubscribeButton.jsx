"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/provider/NotificationContext";

export default function SubscribeButton() {
  const {
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
  } = useNotifications();

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  return (
    <div className="fixed bottom-4 right-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className={`rounded-full h-12 w-12 relative ${isConnected ? "bg-green-500" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="p-2 border-b flex justify-between items-center">
            <span className="font-semibold">Notifications</span>
            <div className="space-x-2">
              {isSubscribed ? (
                <Button variant="destructive" size="sm" onClick={unsubscribe}>
                  Unsubscribe
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button size="sm" onClick={() => subscribe(false)}>
                    Subscribe
                  </Button>
                  <Button size="sm" onClick={() => subscribe(true)}>
                    With Location
                  </Button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-2 text-red-500 text-sm border-b">
              {error.message}
            </div>
          )}

          <div className="p-2 border-b flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm">
                {isConnected
                  ? "Connected"
                  : `Disconnected ${connectionAttempts > 0 ? `(Attempt ${connectionAttempts}/${MAX_RETRIES})` : ""}`}
              </span>
            </div>
            {error && (
              <span className="text-xs text-red-500">{error.message}</span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {isSubscribed
                  ? "No notifications yet"
                  : "Subscribe to receive notifications"}
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-sm text-gray-600">
                    {notification.description || notification.update_text}
                  </div>
                  {notification.affected_locations && (
                    <div className="text-xs text-gray-500 mt-1">
                      {notification.affected_locations[0]?.address?.city},
                      {notification.affected_locations[0]?.address?.district}
                    </div>
                  )}
                  {!notification.isRead && (
                    <div className="text-xs text-blue-500 mt-1">New</div>
                  )}
                </div>
              ))
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
