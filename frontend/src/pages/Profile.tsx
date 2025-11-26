import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usersService } from '../services/users';
import type { UserProfile } from '../services/users';
import { followsService } from '../services/follows';
import { Button } from '@/components/ui/button';
import {
  User,
  Music,
  Heart,
  MessageCircle,
  Users,
  UserPlus,
  UserMinus,
  Calendar,
} from 'lucide-react';

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (id) {
      loadProfile();
    }
  }, [id]);

  const loadProfile = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await usersService.getProfile(id);
      setProfile(data);
      setFollowing(data.isFollowing);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!id || !profile) return;
    try {
      if (following) {
        await followsService.unfollow(id);
        setFollowing(false);
        setProfile({
          ...profile,
          stats: {
            ...profile.stats,
            followers: profile.stats.followers - 1,
          },
        });
      } else {
        await followsService.follow(id);
        setFollowing(true);
        setProfile({
          ...profile,
          stats: {
            ...profile.stats,
            followers: profile.stats.followers + 1,
          },
        });
      }
    } catch (err: any) {
      console.error('Erreur lors du follow/unfollow:', err);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center py-12">
          <p className="text-neutral-500">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header du profil */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center overflow-hidden">
              {profile.user.avatar ? (
                <img
                  src={profile.user.avatar}
                  alt={profile.user.name || profile.user.email}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-neutral-600 dark:text-neutral-400" />
              )}
            </div>
          </div>

          {/* Infos utilisateur */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {profile.user.name || profile.user.username || profile.user.email}
                </h1>
                {profile.user.username && (
                  <p className="text-neutral-500 dark:text-neutral-400 mb-2">
                    @{profile.user.username}
                  </p>
                )}
                {profile.user.bio && (
                  <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                    {profile.user.bio}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Membre depuis{' '}
                    {new Date(profile.user.createdAt).toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              {!profile.isOwnProfile && (
                <Button
                  onClick={handleFollow}
                  variant={following ? 'outline' : 'default'}
                  className="flex items-center gap-2"
                >
                  {following ? (
                    <>
                      <UserMinus className="w-4 h-4" />
                      Ne plus suivre
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Suivre
                    </>
                  )}
                </Button>
              )}
              {profile.isOwnProfile && (
                <Button asChild variant="outline">
                  <Link to="/settings">Modifier le profil</Link>
                </Button>
              )}
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{profile.stats.tracks}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-1">
                  <Music className="w-4 h-4" />
                  Tracks
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{profile.stats.followers}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-1">
                  <Users className="w-4 h-4" />
                  Followers
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{profile.stats.following}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-1">
                  <Users className="w-4 h-4" />
                  Suivis
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{profile.stats.likes}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-1">
                  <Heart className="w-4 h-4" />
                  Likes
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{profile.stats.comments}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  Commentaires
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projets */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Projets ({profile.projects.length})</h2>
        {profile.projects.length === 0 ? (
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-12 text-center">
            <Music className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
            <p className="text-neutral-600 dark:text-neutral-400">
              Aucun projet pour le moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.projects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Stats du projet */}
                <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Music className="w-4 h-4" />
                    {project.tracksCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {project.likesCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {project.commentsCount}
                  </span>
                </div>

                {/* Liste des tracks */}
                {project.tracks.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase mb-2">
                      Tracks
                    </p>
                    {project.tracks.map((track) => (
                      <div
                        key={track.id}
                        className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-900 rounded text-sm"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{track.name}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {formatDuration(track.duration)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

