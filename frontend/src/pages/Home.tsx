import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Armed App</h1>
      <p>Gestionnaire de projets pour artistes</p>
      
      {isAuthenticated ? (
        <div>
          <p>Bienvenue, {user?.name || user?.email} !</p>
          <button onClick={logout}>Déconnexion</button>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/projects">Voir mes projets</Link>
          </div>
        </div>
      ) : (
        <div>
          <p>Connectez-vous pour accéder à vos projets</p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </div>
        </div>
      )}
    </div>
  );
}