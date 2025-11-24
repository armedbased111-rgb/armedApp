import { api } from "./api";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name?: string;
}

export interface AuthResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        return api.post('/auth/login', credentials);
    },
    async register(data: RegisterData): Promise<AuthResponse> {
        return api.post('/auth/register', data);
    },
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    getUser() {
        const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
    },
    setAuth(token: string, user: any) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },
    getToken(): string | null {
        return localStorage.getItem('token');
    },
    isAuthenticated(): boolean {
        return !!this.getToken();
    },
}
