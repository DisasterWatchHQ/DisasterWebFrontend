// Notification utility functions
export const checkNotificationPermission = async () => {
  if (!('Notification' in window)) {
    throw new Error('This browser does not support notifications');
  }
  
  return Notification.permission;
};

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    throw error;
  }
};

export const subscribeToPushNotifications = async (registration) => {
  try {
    // Get the VAPID public key from environment variables
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      throw new Error('VAPID public key is not configured');
    }

    // Convert VAPID key to Uint8Array
    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    });
    
    // Get the current user's token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User must be logged in to subscribe to notifications');
    }

    // Send the subscription to your backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/web/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        subscription,
        userAgent: navigator.userAgent,
        platform: navigator.platform
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to subscribe to notifications');
    }
    
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw error;
  }
};

export const unsubscribeFromPushNotifications = async (registration) => {
  try {
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      
      // Get the current user's token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User must be logged in to unsubscribe from notifications');
      }

      // Notify backend about unsubscription
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/web/unsubscribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to unsubscribe from notifications');
      }
    }
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    throw error;
  }
};

export const showNotification = async (title, options = {}) => {
  try {
    const permission = await checkNotificationPermission();
    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: '/icons/notification-icon.png',
        badge: '/icons/notification-badge.png',
        ...options,
      });
    }
  } catch (error) {
    console.error('Error showing notification:', error);
    throw error;
  }
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
} 