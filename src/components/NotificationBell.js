import React from "react";
import { useNotifications } from "../contexts/NotificationContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function NotificationBell() {
  const {
    notifications,
    isConnected,
    error,
    clearNotifications,
    hasLocationPermission,
  } = useNotifications();
  const unreadCount = notifications.length;

  const connectionStatus = error ? (
    <span className="text-red-500 text-xs">Connection error</span>
  ) : !isConnected ? (
    <span className="text-yellow-500 text-xs">Connecting...</span>
  ) : null;

  return (
    <DropdownMenu>
      <div className="relative">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative">
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
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        {/* Location status message */}
        {hasLocationPermission === false && (
          <small className="absolute -bottom-5 right-0 whitespace-nowrap text-gray-500 text-xs">
            Using general notifications
          </small>
        )}
      </div>
      <DropdownMenuContent className="w-80">
        <div className="flex justify-between items-center p-2 border-b">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <Button variant="ghost" size="sm" onClick={clearNotifications}>
            Clear all
          </Button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <DropdownMenuItem disabled>
              <span className="text-muted-foreground">No notifications</span>
            </DropdownMenuItem>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="p-0">
                <NotificationItem notification={notification} />
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationItem({ notification }) {
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-red-100 border-red-500";
      case "high":
        return "bg-orange-100 border-orange-500";
      case "medium":
        return "bg-yellow-100 border-yellow-500";
      case "low":
        return "bg-green-100 border-green-500";
      default:
        return "bg-gray-100 border-gray-500";
    }
  };

  return (
    <div
      className={`p-4 border-l-4 ${getSeverityColor(notification.severity)} hover:bg-gray-50`}
    >
      <div className="flex items-start">
        <div className="flex-1">
          <p className="font-semibold">{notification.title}</p>
          <p className="text-sm text-gray-600">
            {notification.description || notification.update_text}
          </p>
          {notification.affected_locations && (
            <p className="text-xs text-gray-500 mt-1">
              {notification.affected_locations[0]?.address?.city},
              {notification.affected_locations[0]?.address?.district}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
