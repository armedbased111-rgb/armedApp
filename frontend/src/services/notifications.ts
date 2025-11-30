import { api } from './api';

export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
}

export interface NotificationActor {
  id: string;
  email: string;
  name?: string;
  username?: string;
  avatar?: string;
}

export interface NotificationTarget {
  id: string;
  name: string;
  fileName: string;
  filePath: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  actorId: string;
  actor?: NotificationActor;
  targetId: string | null;
  target?: NotificationTarget | null;
  read: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
}

export interface UnreadCountResponse {
  count: number;
}

export const notificationsService = {
  getNotifications: async (
    limit?: number,
    offset?: number,
    unreadOnly?: boolean,
  ): Promise<NotificationsResponse> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    if (unreadOnly) params.append('unreadOnly', 'true');
    
    const queryString = params.toString();
    const endpoint = queryString ? `/notifications?${queryString}` : '/notifications';
    
    return api.get(endpoint);
  },

  getUnreadCount: async (): Promise<number> => {
    const response: UnreadCountResponse = await api.get('/notifications/unread-count');
    return response.count;
  },

  markAsRead: async (notificationId: string): Promise<Notification> => {
    return api.put(`/notifications/${notificationId}/read`, {});
  },

  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/read-all', {});
  },
};

