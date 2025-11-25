import { api } from './api';
import type { Track } from './tracks';

export interface UploadFileResponse {
  track: Track;
  file: {
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimetype: string;
  };
}

export interface UploadFileOptions {
  file: File;
  projectId: string;
  name?: string; // Nom optionnel pour la track
}

export const filesService = {
  // Upload un fichier audio et créer automatiquement une track
  upload: async (options: UploadFileOptions): Promise<UploadFileResponse> => {
    // Créer un FormData pour l'upload
    const formData = new FormData();
    formData.append('file', options.file);
    formData.append('projectId', options.projectId);
    
    // Ajouter le nom si fourni
    if (options.name) {
      formData.append('name', options.name);
    }

    // Faire la requête avec FormData
    const token = localStorage.getItem('token');
    const response = await fetch(`${api.baseUrl}/files/upload`, {
      method: 'POST',
      headers: {
        // Ne pas mettre Content-Type, le navigateur le fait automatiquement pour FormData
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Télécharger un fichier
  download: async (filename: string): Promise<Blob> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${api.baseUrl}/files/${filename}/download`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  },
};