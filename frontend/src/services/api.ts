export const API_BASE_URL = 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  baseUrl: API_BASE_URL, // Exposer baseUrl pour filesService

  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      return response.text();
    }
  },

  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  put: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    // Pour DELETE, vérifier si la réponse a du contenu avant de parser
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    // Si status 204 (No Content) ou pas de contenu, retourner undefined
    if (response.status === 204 || contentLength === '0') {
      return;
    }
    
    // Si pas de Content-Type JSON ou réponse vide, retourner undefined
    if (!contentType || !contentType.includes('application/json')) {
      return;
    }
    
    // Essayer de parser le JSON, mais gérer les erreurs si la réponse est vide
    try {
      const text = await response.text();
      if (!text || text.trim() === '') {
        return;
      }
      return JSON.parse(text);
    } catch {
      // Si erreur de parsing, la réponse était probablement vide
      return;
    }
  },
};