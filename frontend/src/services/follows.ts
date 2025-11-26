import { api } from './api';

export const followsService = {
  follow: async (userId: string) => {
    return api.post(`/follows/${userId}`, {});
  },
  unfollow: async (userId: string) => {
    return api.delete(`/follows/${userId}`);
  },
  getStatus: async (userId: string): Promise<{ isFollowing: boolean }> => {
    return api.get(`/follows/${userId}/status`);
  },
  getFollowers: async (userId: string) => {
    return api.get(`/follows/${userId}/followers`);
  },
  getFollowing: async (userId: string) => {
    return api.get(`/follows/${userId}/following`);
  },
};

