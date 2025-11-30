import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { searchService, type SearchUser, type SearchTrack, type SearchProject } from '../services/search';
import { Search, User, Music, FolderOpen } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    users: SearchUser[];
    tracks: SearchTrack[];
    projects: SearchProject[];
  }>({
    users: [],
    tracks: [],
    projects: [],
  });

  const debouncedQuery = useDebounce(query, 500);

  const performSearch = useCallback(async (searchQuery: string, tab: string) => {
    if (!searchQuery.trim()) {
      setResults({ users: [], tracks: [], projects: [] });
      return;
    }

    setLoading(true);
    try {
      if (tab === 'all') {
        const data = await searchService.search(searchQuery, 20);
        setResults(data);
      } else if (tab === 'users') {
        const users = await searchService.searchUsers(searchQuery, 20);
        setResults({ users, tracks: [], projects: [] });
      } else if (tab === 'tracks') {
        const tracks = await searchService.searchTracks(searchQuery, 20);
        setResults({ users: [], tracks, projects: [] });
      } else if (tab === 'projects') {
        const projects = await searchService.searchProjects(searchQuery, 20);
        setResults({ users: [], tracks: [], projects });
      }
    } catch (error: any) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery, activeTab);
    } else {
      setResults({ users: [], tracks: [], projects: [] });
    }
  }, [debouncedQuery, activeTab, performSearch]);

  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery);
    }
  }, [initialQuery, query]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSearchParams({ q: newQuery });
  };

  const getInitials = (name?: string, username?: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (username) {
      return username.slice(0, 2).toUpperCase();
    }
    return '?';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Recherche</h1>
        <p className="text-muted-foreground">
          Recherchez des artistes, tracks et projets
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher..."
            value={query}
            onChange={handleInputChange}
            className="pl-10 h-12 text-lg"
          />
        </div>
      </div>

      {query.trim() && (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Tout</TabsTrigger>
            <TabsTrigger value="users">Artistes</TabsTrigger>
            <TabsTrigger value="tracks">Tracks</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
          </TabsList>

          {loading && (
            <div className="mt-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && query.trim() && (
            <>
              <TabsContent value="all" className="mt-6">
                <div className="space-y-6">
                  {results.users.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <User className="h-5 w-5" />
                        <h2 className="text-xl font-semibold">Artistes ({results.users.length})</h2>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {results.users.map((user) => (
                          <Card key={user.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <Link
                                to={`/profile/${user.id}`}
                                className="flex items-center gap-3"
                              >
                                <Avatar>
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>
                                    {getInitials(user.name, user.username)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold truncate">
                                    {user.name || user.username || user.email}
                                  </p>
                                  {user.username && (
                                    <p className="text-sm text-muted-foreground truncate">
                                      @{user.username}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.tracks.length > 0 && (
                    <div>
                      <Separator className="my-6" />
                      <div className="flex items-center gap-2 mb-4">
                        <Music className="h-5 w-5" />
                        <h2 className="text-xl font-semibold">Tracks ({results.tracks.length})</h2>
                      </div>
                      <div className="grid gap-4">
                        {results.tracks.map((track) => (
                          <Card key={track.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <Link
                                    to={`/profile/${track.project?.user?.id}`}
                                    className="flex items-center gap-2 mb-2"
                                  >
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={track.project?.user?.avatar} />
                                      <AvatarFallback>
                                        {getInitials(
                                          track.project?.user?.name,
                                          track.project?.user?.username
                                        )}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-muted-foreground">
                                      {track.project?.user?.name || track.project?.user?.username}
                                    </span>
                                  </Link>
                                  <h3 className="font-semibold text-lg mb-1">{track.name}</h3>
                                  {track.project && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {track.project.name}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    {formatDuration(track.duration) && (
                                      <span>{formatDuration(track.duration)}</span>
                                    )}
                                    {formatFileSize(track.fileSize) && (
                                      <span>{formatFileSize(track.fileSize)}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.projects.length > 0 && (
                    <div>
                      <Separator className="my-6" />
                      <div className="flex items-center gap-2 mb-4">
                        <FolderOpen className="h-5 w-5" />
                        <h2 className="text-xl font-semibold">Projets ({results.projects.length})</h2>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {results.projects.map((project) => (
                          <Card key={project.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <Link
                                to={`/profile/${project.user?.id}`}
                                className="flex items-center gap-2 mb-3"
                              >
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={project.user?.avatar} />
                                  <AvatarFallback>
                                    {getInitials(project.user?.name, project.user?.username)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-muted-foreground">
                                  {project.user?.name || project.user?.username}
                                </span>
                              </Link>
                              <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                              {project.description && (
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                  {project.description}
                                </p>
                              )}
                              {project.tracksCount !== undefined && (
                                <Badge variant="secondary">
                                  {project.tracksCount} track{project.tracksCount > 1 ? 's' : ''}
                                </Badge>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.users.length === 0 &&
                    results.tracks.length === 0 &&
                    results.projects.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">
                          Aucun résultat trouvé pour "{query}"
                        </p>
                      </div>
                    )}
                </div>
              </TabsContent>

              <TabsContent value="users" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {results.users.map((user) => (
                    <Card key={user.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <Link
                          to={`/profile/${user.id}`}
                          className="flex items-center gap-3"
                        >
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {getInitials(user.name, user.username)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">
                              {user.name || user.username || user.email}
                            </p>
                            {user.username && (
                              <p className="text-sm text-muted-foreground truncate">
                                @{user.username}
                              </p>
                            )}
                            {user.bio && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {user.bio}
                              </p>
                            )}
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {results.users.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Aucun artiste trouvé pour "{query}"
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tracks" className="mt-6">
                <div className="grid gap-4">
                  {results.tracks.map((track) => (
                    <Card key={track.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/profile/${track.project?.user?.id}`}
                              className="flex items-center gap-2 mb-2"
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={track.project?.user?.avatar} />
                                <AvatarFallback>
                                  {getInitials(
                                    track.project?.user?.name,
                                    track.project?.user?.username
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">
                                {track.project?.user?.name || track.project?.user?.username}
                              </span>
                            </Link>
                            <h3 className="font-semibold text-lg mb-1">{track.name}</h3>
                            {track.project && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {track.project.name}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {formatDuration(track.duration) && (
                                <span>{formatDuration(track.duration)}</span>
                              )}
                              {formatFileSize(track.fileSize) && (
                                <span>{formatFileSize(track.fileSize)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {results.tracks.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Aucune track trouvée pour "{query}"
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {results.projects.map((project) => (
                    <Card key={project.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <Link
                          to={`/profile/${project.user?.id}`}
                          className="flex items-center gap-2 mb-3"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={project.user?.avatar} />
                            <AvatarFallback>
                              {getInitials(project.user?.name, project.user?.username)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {project.user?.name || project.user?.username}
                          </span>
                        </Link>
                        <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                        {project.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                        {project.tracksCount !== undefined && (
                          <Badge variant="secondary">
                            {project.tracksCount} track{project.tracksCount > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {results.projects.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Aucun projet trouvé pour "{query}"
                    </p>
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      )}

      {!query.trim() && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Entrez un terme de recherche pour commencer
          </p>
        </div>
      )}
    </div>
  );
}

