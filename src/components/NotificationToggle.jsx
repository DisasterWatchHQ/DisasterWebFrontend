'use client';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { useNotifications } from '@/provider/NotificationProvider';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { requestNotificationPermission } from '@/lib/notifications';
import { useUser } from '@/provider/UserContext';

export function NotificationToggle() {
  const { permission, subscription, unsubscribe, error } = useNotifications();
  const { toast } = useToast();
  const { isLoggedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error) {
      toast({
        title: "Notification Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleToggle = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to manage notification preferences.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      if (subscription) {
        await unsubscribe();
        toast({
          title: "Notifications Disabled",
          description: "You will no longer receive push notifications.",
        });
      } else {
        const newPermission = await requestNotificationPermission();
        if (newPermission === 'granted') {
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
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Button
        variant="outline"
        size="icon"
        disabled
        className="animate-pulse"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (!isLoggedIn) {
    return (
      <Button
        variant="outline"
        size="icon"
        disabled
        title="Please log in to manage notifications"
      >
        <BellOff className="h-4 w-4 text-muted-foreground" />
      </Button>
    );
  }

  if (permission === 'denied') {
    return (
      <Button
        variant="outline"
        size="icon"
        disabled
        title="Notifications are blocked. Please update your browser settings to enable notifications."
      >
        <BellOff className="h-4 w-4 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      title={subscription ? 'Disable notifications' : 'Enable notifications'}
      className={subscription ? 'text-primary' : 'text-muted-foreground'}
    >
      {subscription ? (
        <Bell className="h-4 w-4" />
      ) : (
        <BellOff className="h-4 w-4" />
      )}
    </Button>
  );
} 