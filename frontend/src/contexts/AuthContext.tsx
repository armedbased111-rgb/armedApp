import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth';

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface AuthContextType {
    user: any | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const storedUser = authService.getUser();
        if (storedUser && authService.isAuthenticated()) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
    const response: AuthResponse = await authService.login({ email, password });
    authService.setAuth(response.access_token, response.user);
    setUser(response.user);
  };

  const register = async (email: string, password: string, name?: string) => {
    const response: AuthResponse = await authService.register({ email, password, name });
    authService.setAuth(response.access_token, response.user);
    setUser(response.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, loading }}>
        {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => { 
    const context = useContext(AuthContext); 
    if (context === undefined) {
    throw new Error('useAuth must be defined in AuthProvider')
}
return context;
}