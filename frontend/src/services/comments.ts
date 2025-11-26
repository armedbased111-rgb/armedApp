import { api } from './api';

export interface Comment {
  id: string;
  content: string;
  userId: string;
  trackId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    username?: string;
    avatar?: string;
  };
}

export const commentsService = {
  create: async (trackId: string, content: string): Promise<Comment> => {
    return api.post('/comments', { trackId, content });
  },
  update: async (id: string, content: string): Promise<Comment> => {
    return api.put(`/comments/${id}`, { content });
  },
  delete: async (id: string): Promise<void> => {
    return api.delete(`/comments/${id}`);
  },
  getByTrack: async (trackId: string): Promise<Comment[]> => {
    return api.get(`/comments/track/${trackId}`);
  },
  getById: async (id: string): Promise<Comment> => {
    return api.get(`/comments/${id}`);
  },
  getCount: async (trackId: string): Promise<{ count: number }> => {
    return api.get(`/comments/track/${trackId}/count`);
  },
};

