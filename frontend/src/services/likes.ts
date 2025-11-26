import { api } from './api';

export const likesService = {
  like: async (trackId: string) => {
    return api.post(`/likes/${trackId}`, {});
  },
  unlike: async (trackId: string) => {
    return api.delete(`/likes/${trackId}`);
  },
  getStatus: async (trackId: string): Promise<{ isLiked: boolean }> => {
    return api.get(`/likes/${trackId}/status`);
  },
  getLikes: async (trackId: string) => {
    return api.get(`/likes/${trackId}`);
  },
  getCount: async (trackId: string): Promise<{ count: number }> => {
    return api.get(`/likes/${trackId}/count`);
  },
};

