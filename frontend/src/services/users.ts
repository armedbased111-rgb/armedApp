import { api } from './api';

export interface UserProfile {
  user: {
    id: string;
    email: string;
    name?: string;
    username?: string;
    avatar?: string;
    bio?: string;
    createdAt: string;
  };
  stats: {
    followers: number;
    following: number;
    tracks: number;
    likes: number;
    comments: number;
  };
  projects: Array<{
    id: string;
    name: string;
    description?: string;
    userId: string;
    createdAt: string;
    tracksCount: number;
    likesCount: number;
    commentsCount: number;
    tracks: Array<{
      id: string;
      name: string;
      fileName: string;
      filePath: string;
      duration?: number;
      fileSize?: number;
      projectId: string;
      createdAt: string;
    }>;
  }>;
  isFollowing: boolean;
  isOwnProfile: boolean;
}

export const usersService = {
  getProfile: async (userId: string): Promise<UserProfile> => {
    return api.get(`/users/${userId}/profile`);
  },
};

