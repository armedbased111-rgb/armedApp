import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { notificationsService, type Notification } from '../services/notifications';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refreshNotifications: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const unreadCountRef = useRef<number>(0);

  const refreshNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await notificationsService.getNotifications(20, 0, false);
      setNotifications(response.notifications);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des notifications');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const refreshUnreadCount = useCallback(async (): Promise<number> => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return 0;
    }

    try {
      const count = await notificationsService.getUnreadCount();
      setUnreadCount(count);
      unreadCountRef.current = count;
      return count;
    } catch (err: any) {
      console.error('Error loading unread count:', err);
      return unreadCountRef.current;
    }
  }, [isAuthenticated]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
      // Mettre à jour localement
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      // Décrémenter le compteur si la notification était non lue
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsService.markAllAsRead();
      // Mettre à jour localement
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err);
      throw err;
    }
  }, []);

  // Charger les notifications au montage et quand l'authentification change
  useEffect(() => {
    if (isAuthenticated) {
      refreshNotifications();
      refreshUnreadCount();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, refreshNotifications, refreshUnreadCount]);

  // Polling automatique : compteur toutes les 10 secondes, notifications toutes les 30 secondes
  useEffect(() => {
    if (!isAuthenticated) return;

    // Rafraîchir le compteur toutes les 10 secondes
    const countInterval = setInterval(async () => {
      const previousCount = unreadCountRef.current;
      const newCount = await refreshUnreadCount();
      // Si le compteur a changé, rafraîchir les notifications
      if (newCount !== previousCount) {
        refreshNotifications();
      }
    }, 10000); // 10 secondes pour le compteur

    // Rafraîchir les notifications toutes les 30 secondes
    const notificationsInterval = setInterval(() => {
      refreshNotifications();
    }, 30000); // 30 secondes pour les notifications

    return () => {
      clearInterval(countInterval);
      clearInterval(notificationsInterval);
    };
  }, [isAuthenticated, refreshNotifications, refreshUnreadCount]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        refreshNotifications,
        refreshUnreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

