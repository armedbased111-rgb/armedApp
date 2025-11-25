import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { filesService } from '../services/files';
import { projectsService, type Project } from '../services/projects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Upload() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectId, setProjectId] = useState('');
  const [trackName, setTrackName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Charger les projets
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectsService.getAll();
      setProjects(data);
      // Sélectionner le premier projet par défaut s'il existe
      if (data.length > 0 && !projectId) {
        setProjectId(data[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des projets');
    }
  };

  // Gérer la sélection de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier que c'est un fichier audio
      const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/flac', 'audio/aiff', 'audio/ogg'];
      const allowedExtensions = ['.mp3', '.wav', '.flac', '.aiff', '.aif', '.ogg', '.m4a'];
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
        setError('Veuillez sélectionner un fichier audio (MP3, WAV, FLAC, AIFF, OGG)');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError('');
      // Définir le nom de la track par défaut (sans extension)
      if (!trackName) {
        setTrackName(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  // Upload du fichier
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    if (!projectId) {
      setError('Veuillez sélectionner un projet');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const result = await filesService.upload({
        file: selectedFile,
        projectId,
        name: trackName || undefined,
      });

      setSuccess(`Track "${result.track.name}" uploadée avec succès !`);
      
      // Réinitialiser le formulaire
      setSelectedFile(null);
      setTrackName('');
      const fileInput = document.getElementById('file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Rediriger vers le projet après 2 secondes
      setTimeout(() => {
        navigate(`/projects/${projectId}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'upload du fichier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Uploader une Track</h1>

      {error && (
        <div className="mb-4 p-3 bg-destructive/15 text-destructive rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-500/15 text-green-600 dark:text-green-400 rounded-md">
          {success}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Nouvelle Track</CardTitle>
          <CardDescription>
            Uploader un fichier audio et créer automatiquement une track
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            {/* Sélection de projet */}
            <div>
              <Label htmlFor="project">Projet *</Label>
              <select
                id="project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                required
              >
                <option value="">Sélectionner un projet</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              {projects.length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Aucun projet disponible. <a href="/projects" className="underline">Créer un projet</a>
                </p>
              )}
            </div>

            {/* Sélection de fichier */}
            <div>
              <Label htmlFor="file">Fichier audio *</Label>
              <Input
                id="file"
                type="file"
                accept="audio/*,.mp3,.wav,.flac,.aiff,.aif,.ogg,.m4a"
                onChange={handleFileChange}
                required
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Fichier sélectionné: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Nom de la track */}
            <div>
              <Label htmlFor="trackName">Nom de la track</Label>
              <Input
                id="trackName"
                value={trackName}
                onChange={(e) => setTrackName(e.target.value)}
                placeholder="Nom de la track (optionnel)"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Si non spécifié, le nom du fichier sera utilisé
              </p>
            </div>

            {/* Bouton submit */}
            <Button type="submit" disabled={loading || !selectedFile || !projectId}>
              {loading ? 'Upload en cours...' : 'Uploader'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

