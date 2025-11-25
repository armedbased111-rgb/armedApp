import { api } from "./api";

export interface Track {
    id: string;
    name: string;
    fileName: string;
    filePath: string;
    duration?: number;
    fileSize?: number;
    projectId: string;
    createdAt: string;
}

export interface createTrackDto {
    name: string;
  projectId: string;
  filename: string;
  filePath: string;
  duration?: number;
  fileSize?: number;
}

export const tracksService = { 
    // recuperer tous les tracks d'un project
    getByProject: async (projectId: string): Promise<Track[]> => {
        return api.get(`/tracks?projectId=${projectId}`);
    },
    // recuperer un track par son id
    getById: async (id: string): Promise<Track> => {
        return api.get(`/tracks/${id}`);
    },
    // Créer une nouvelle track (no upload)
    create: async (data: createTrackDto): Promise<Track> => {
        return api.post('/tracks', data);
    },
    // Supprimer une track
    delete: async (id: string): Promise<void> => {
        return api.delete(`/tracks/${id}`);
    },
}