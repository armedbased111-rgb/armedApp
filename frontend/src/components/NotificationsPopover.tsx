import { useState } from 'react';
import * as React from 'react';
import { Bell, Heart, MessageCircle, UserPlus, X } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationsContext';
import { NotificationType, type Notification } from '../services/notifications';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.LIKE:
      return <Heart className="h-4 w-4 text-red-500" />;
    case NotificationType.COMMENT:
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case NotificationType.FOLLOW:
      return <UserPlus className="h-4 w-4 text-green-500" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getNotificationText = (notification: Notification): string => {
  const actorName = notification.actor?.name || notification.actor?.username || 'Quelqu\'un';
  
  switch (notification.type) {
    case NotificationType.LIKE:
      return `${actorName} a aimé ta track`;
    case NotificationType.COMMENT:
      return `${actorName} a commenté ta track`;
    case NotificationType.FOLLOW:
      return `${actorName} t'a suivi`;
    default:
      return 'Nouvelle notification';
  }
};

const getNotificationLink = (notification: Notification): string => {
  if (notification.type === NotificationType.FOLLOW) {
    return `/profile/${notification.actorId}`;
  }
  if (notification.targetId) {
    // Pour LIKE et COMMENT, on pourrait rediriger vers la track
    // Pour l'instant, on redirige vers le profil de l'acteur
    return `/profile/${notification.actorId}`;
  }
  return '/';
};

export function NotificationsPopover() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications, refreshUnreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  // Rafraîchir les notifications quand le popover s'ouvre
  React.useEffect(() => {
    if (open) {
      refreshNotifications();
      refreshUnreadCount();
    }
  }, [open, refreshNotifications, refreshUnreadCount]);

  const handleMarkAsRead = async (notificationId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadNotifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-7 text-xs"
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Aucune notification
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={getNotificationLink(notification)}
                  onClick={(e) => {
                    if (!notification.read) {
                      handleMarkAsRead(notification.id, e);
                    }
                    setOpen(false);
                  }}
                  className={cn(
                    "flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors",
                    !notification.read && "bg-muted/30"
                  )}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={notification.actor?.avatar} />
                    <AvatarFallback>
                      {notification.actor?.name?.[0] || notification.actor?.username?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notification.type)}
                        <p className="text-sm font-medium line-clamp-2">
                          {getNotificationText(notification)}
                        </p>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    {notification.target && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {notification.target.name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

