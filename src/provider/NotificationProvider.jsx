'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  checkNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  showNotification,
  requestNotificationPermission
} from '@/lib/notifications';
import { useUser } from './UserContext';

const NotificationContext = createContext({
  permission: 'default',
  subscription: null,
  error: null,
  requestPermission: async () => {},
  unsubscribe: async () => {},
  sendNotification: async () => {},
});

export function NotificationProvider({ children }) {
  const [permission, setPermission] = useState('default');
  const [subscription, setSubscription] = useState(null);
  const [serviceWorkerRegistration, setServiceWorkerRegistration] = useState(null);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { isLoggedIn } = useUser();

  const handlePermissionChange = (event) => {
    if (event.target.state === 'granted') {
      setPermission('granted');
      // Automatically subscribe when permission is granted
      subscribeToPushNotifications()
        .then(setSubscription)
        .catch((error) => {
          console.error('Error subscribing to push notifications:', error);
          setError('Failed to subscribe to notifications');
        });
    } else if (event.target.state === 'denied') {
      setPermission('denied');
      setSubscription(null);
    } else {
      setPermission('default');
      setSubscription(null);
    }
  };

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        setError(null);

        // Check if the browser supports notifications
        if (!('Notification' in window)) {
          throw new Error('This browser does not support notifications');
        }

        // Check if service workers are supported
        if (!('serviceWorker' in navigator)) {
          throw new Error('Service workers are not supported in this browser');
        }

        // Check notification permission
        const currentPermission = await checkNotificationPermission();
        setPermission(currentPermission);

        // Register service worker with retry logic
        let registration;
        try {
          registration = await navigator.serviceWorker.register('/service-worker.js');
        } catch (error) {
          console.error('Service worker registration failed:', error);
          // Retry once after a delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          registration = await navigator.serviceWorker.register('/service-worker.js');
        }

        setServiceWorkerRegistration(registration);

        // Check for existing subscription
        const existingSubscription = await registration.pushManager.getSubscription();
        if (existingSubscription) {
          setSubscription(existingSubscription);
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
        setError(error.message);
        toast({
          title: "Notification Error",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    initializeNotifications();
  }, [toast]);

  useEffect(() => {
    // Check if notifications are supported
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setError('Push notifications are not supported in this browser');
      return;
    }

    // Check initial permission state
    setPermission(Notification.permission);

    // If permission is already granted, try to get subscription
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready
        .then((registration) => registration.pushManager.getSubscription())
        .then(setSubscription)
        .catch((error) => {
          console.error('Error getting push subscription:', error);
          setError('Failed to get push subscription');
        });
    }

    // Listen for permission changes
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'notifications' })
        .then((permissionStatus) => {
          permissionStatus.addEventListener('change', handlePermissionChange);
          return () => {
            permissionStatus.removeEventListener('change', handlePermissionChange);
          };
        })
        .catch((error) => {
          console.error('Error setting up permission listener:', error);
          setError('Failed to set up permission listener');
        });
    }
  }, []);

  const requestPermission = async () => {
    try {
      setError(null);
      const newPermission = await requestNotificationPermission();
      setPermission(newPermission);

      if (newPermission === 'granted') {
        const newSubscription = await subscribeToPushNotifications();
        setSubscription(newSubscription);
        toast({
          title: "Notifications Enabled",
          description: "You will now receive important updates about disasters in your area.",
        });
      } else if (newPermission === 'denied') {
        toast({
          title: "Notifications Blocked",
          description: "Please enable notifications in your browser settings to receive updates.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setError('Failed to request notification permission');
      toast({
        title: "Error",
        description: "Failed to enable notifications. Please try again.",
        variant: "destructive",
      });
    }
  };

  const unsubscribe = async () => {
    try {
      setError(null);
      await unsubscribeFromPushNotifications();
      setSubscription(null);
      toast({
        title: "Notifications Disabled",
        description: "You will no longer receive push notifications.",
      });
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
      setError('Failed to unsubscribe from notifications');
      toast({
        title: "Error",
        description: "Failed to disable notifications. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sendNotification = async (title, options = {}) => {
    if (!subscription) {
      throw new Error('No active subscription');
    }

    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          ...options,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  };

  const value = {
    permission,
    subscription,
    error,
    requestPermission,
    unsubscribe,
    sendNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
} 