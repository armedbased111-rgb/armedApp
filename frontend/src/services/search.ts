import { api } from './api';

export interface SearchUser {
  id: string;
  email: string;
  name?: string;
  username?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface SearchTrack {
  id: string;
  name: string;
  fileName: string;
  filePath: string;
  duration?: number;
  fileSize?: number;
  projectId: string;
  createdAt: string;
  project?: {
    id: string;
    name: string;
    userId: string;
    user?: {
      id: string;
      email: string;
      name?: string;
      username?: string;
      avatar?: string;
    };
  };
}

export interface SearchProject {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  tracksCount?: number;
  user?: {
    id: string;
    email: string;
    name?: string;
    username?: string;
    avatar?: string;
  };
}

export interface SearchResult {
  users: SearchUser[];
  tracks: SearchTrack[];
  projects: SearchProject[];
}

export const searchService = {
  search: async (query: string, limit: number = 20): Promise<SearchResult> => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (limit) params.append('limit', limit.toString());
    
    return api.get(`/search?${params.toString()}`);
  },

  searchUsers: async (query: string, limit: number = 20): Promise<SearchUser[]> => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (limit) params.append('limit', limit.toString());
    
    return api.get(`/search/users?${params.toString()}`);
  },

  searchTracks: async (query: string, limit: number = 20): Promise<SearchTrack[]> => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (limit) params.append('limit', limit.toString());
    
    return api.get(`/search/tracks?${params.toString()}`);
  },

  searchProjects: async (query: string, limit: number = 20): Promise<SearchProject[]> => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (limit) params.append('limit', limit.toString());
    
    return api.get(`/search/projects?${params.toString()}`);
  },
};

