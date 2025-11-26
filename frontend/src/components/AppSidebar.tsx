import { Sidebar, SidebarBody, SidebarLink, useSidebar } from './ui/sidebar';
import { Home, Music, Settings, LogOut, LogIn, UserPlus, Menu, X, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Composant interne qui utilise useSidebar (doit être à l'intérieur du SidebarProvider)
function SidebarContent() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { open, setOpen } = useSidebar();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = isAuthenticated
    ? [
        {
          label: 'Accueil',
          href: '/',
          icon: <Home className="w-5 h-5" />,
        },
        {
          label: 'Mes Projets',
          href: '/projects',
          icon: <Music className="w-5 h-5" />,
        },
        {
          label: 'Upload',
          href: '/upload',
          icon: <Upload className="w-5 h-5" />,
        },
        {
          label: 'Paramètres',
          href: '/settings',
          icon: <Settings className="w-5 h-5" />,
        },
        {
          label: 'Déconnexion',
          href: '#',
          icon: <LogOut className="w-5 h-5" />,
          onClick: handleLogout,
        },
      ]
    : [
        {
          label: 'Accueil',
          href: '/',
          icon: <Home className="w-5 h-5" />,
        },
        {
          label: 'Connexion',
          href: '/login',
          icon: <LogIn className="w-5 h-5" />,
        },
        {
          label: 'Inscription',
          href: '/register',
          icon: <UserPlus className="w-5 h-5" />,
        },
      ];

  return (
    <div className={open ? "flex flex-col h-full" : "flex flex-col h-auto"}>
      {/* Header avec logo, titre et bouton toggle */}
      <div className={open ? "flex items-center justify-between gap-2 px-2 py-4" : "flex items-center justify-center px-2 py-4 relative"}>
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {open && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-lg font-semibold text-neutral-700 dark:text-neutral-200 whitespace-nowrap"
              >
                Armed App
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {open && (
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors shrink-0"
            aria-label="Fermer la sidebar"
          >
            <X className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
          </button>
        )}
      </div>

      {/* Liens de navigation */}
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-1 px-2">
          {links.map((link, idx) => (
            <SidebarLink
              key={idx}
              link={link}
              onClick={link.onClick}
            />
          ))}
        </div>
      </div>

      {/* Profil utilisateur */}
      {open && isAuthenticated && user && (
        <div className="px-2 py-4 border-t border-neutral-200 dark:border-neutral-700">
          <Link
            to={`/profile/${user.id}`}
            className={open ? "flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg p-2 transition-colors" : "flex items-center justify-center"}
          >
            <div className="w-8 h-8 rounded-full bg-neutral-300 dark:bg-neutral-600 flex items-center justify-center shrink-0">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                {user.name?.[0] || user.email[0].toUpperCase()}
              </span>
            </div>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex flex-col overflow-hidden"
                >
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
                    {user.name || 'Utilisateur'}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                    {user.email}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>
      )}
    </div>
  );
}

function SidebarToggle() {
  const { open, setOpen } = useSidebar();
  
  // Bouton visible seulement quand la sidebar est fermée
  if (open) {
    return null; // Le bouton X dans le header de la sidebar gère la fermeture
  }
  
  // Bouton en position fixe quand la sidebar est fermée
  return (
    <button
      onClick={() => setOpen(!open)}
      className="fixed left-4 top-4 z-50 p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors shadow-lg"
      aria-label="Ouvrir la sidebar"
    >
      <Menu className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />
    </button>
  );
}

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarBody>
        <SidebarContent />
      </SidebarBody>
      <SidebarToggle />
    </Sidebar>
  );
}

