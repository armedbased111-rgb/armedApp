import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { LoginForm } from '@/components/login-form';
import { feedService } from '../services/feed';
import type { FeedTrack } from '../services/feed';
import { likesService } from '../services/likes';
import { Heart, MessageCircle, Music, User } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, login } = useAuth();
  const [tracks, setTracks] = useState<FeedTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
    } else {
      setShowLoginDialog(false);
      loadFeed();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadFeed();
    }
  }, [isAuthenticated]);

  const loadFeed = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await feedService.getFeed(20, 0);
      setTracks(response.tracks);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du feed');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (trackId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await likesService.unlike(trackId);
      } else {
        await likesService.like(trackId);
      }
      // Recharger le feed pour mettre à jour les stats
      loadFeed();
    } catch (err: any) {
      console.error('Erreur lors du like:', err);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login(email, password);
      setShowLoginDialog(false);
    } catch (err: any) {
      setLoginError(err.message || 'Erreur de connexion');
    } finally {
      setLoginLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <h1 className="text-4xl font-bold mb-4">Armed App</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
            Gestionnaire de projets pour artistes
          </p>
          <p className="text-neutral-500 dark:text-neutral-500 mb-6">
            Connectez-vous pour accéder à votre feed
          </p>
          <div className="flex gap-4">
            <Button onClick={() => setShowLoginDialog(true)}>
              Connexion
            </Button>
            <Button asChild variant="outline">
              <Link to="/register">Inscription</Link>
            </Button>
          </div>
        </div>

        <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <DialogContent className="max-w-7xl p-0 w-full">
            <DialogClose onClick={() => setShowLoginDialog(false)} />
            {loginError && (
              <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive mx-6 mt-6">
                {loginError}
              </div>
            )}
            <LoginForm onSubmit={handleLoginSubmit} />
            <p className="mt-4 text-center text-sm text-muted-foreground pb-6">
              Pas de compte ?{' '}
              <Link to="/register" className="underline underline-offset-4 hover:text-primary">
                S'inscrire
              </Link>
            </p>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Feed</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Découvrez les dernières tracks des artistes que vous suivez
        </p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-neutral-500">Chargement du feed...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {!loading && !error && tracks.length === 0 && (
        <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
          <Music className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
          <h2 className="text-xl font-semibold mb-2">Aucune track dans votre feed</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Commencez à suivre des artistes pour voir leurs tracks ici
          </p>
          <Button asChild>
            <Link to="/projects">Voir mes projets</Link>
          </Button>
        </div>
      )}

      {!loading && !error && tracks.length > 0 && (
        <div className="space-y-6">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm"
            >
              {/* Header avec auteur */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                  {track.project.user.avatar ? (
                    <img
                      src={track.project.user.avatar}
                      alt={track.project.user.name || track.project.user.email}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">
                    {track.project.user.name || track.project.user.username || track.project.user.email}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {track.project.name}
                  </p>
                </div>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {new Date(track.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>

              {/* Info track */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">{track.name}</h3>
                <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                  <span>{formatDuration(track.duration)}</span>
                  {track.fileSize && (
                    <span>{(track.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                  )}
                </div>
              </div>

              {/* Actions (Like, Comment) */}
              <div className="flex items-center gap-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <button
                  onClick={() => handleLike(track.id, track.isLiked)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    track.isLiked
                      ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${track.isLiked ? 'fill-current' : ''}`} />
                  <span>{track.likeCount}</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>{track.commentCount}</span>
                </button>
              </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
}
