import { FloatingNav } from './ui/floating-navbar';
import { Home, Music, LogOut, LogIn, UserPlus, Upload, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AppSidebar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = isAuthenticated
    ? [
        {
          name: 'Accueil',
          link: '/',
          icon: <Home className="w-4 h-4" />,
        },
        {
          name: 'Projets',
          link: '/projects',
          icon: <Music className="w-4 h-4" />,
        },
        {
          name: 'Upload',
          link: '/upload',
          icon: <Upload className="w-4 h-4" />,
        },
        {
          name: 'Profil',
          link: `/profile/${user?.id}`,
          icon: <User className="w-4 h-4" />,
        },
        {
          name: 'Déconnexion',
          link: '#',
          icon: <LogOut className="w-4 h-4" />,
          onClick: handleLogout,
        },
      ]
    : [
        {
          name: 'Accueil',
          link: '/',
          icon: <Home className="w-4 h-4" />,
        },
        {
          name: 'Connexion',
          link: '/login',
          icon: <LogIn className="w-4 h-4" />,
        },
        {
          name: 'Inscription',
          link: '/register',
          icon: <UserPlus className="w-4 h-4" />,
        },
      ];

  return <FloatingNav navItems={navItems} showSearch={true} />;
}
