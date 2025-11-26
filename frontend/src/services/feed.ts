import { api } from './api';

export interface FeedTrack {
  id: string;
  name: string;
  fileName: string;
  filePath: string;
  duration?: number;
  fileSize?: number;
  projectId: string;
  createdAt: string;
  project: {
    id: string;
    name: string;
    userId: string;
    user: {
      id: string;
      email: string;
      name?: string;
      username?: string;
      avatar?: string;
    };
  };
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

export interface FeedResponse {
  tracks: FeedTrack[];
  total: number;
  hasMore: boolean;
}

export const feedService = {
  getFeed: async (limit?: number, offset?: number): Promise<FeedResponse> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const queryString = params.toString();
    const endpoint = queryString ? `/feed?${queryString}` : '/feed';
    
    return api.get(endpoint);
  },
};

