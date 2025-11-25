import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsService, type Project } from '../services/projects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const navigate = useNavigate();

  // Formulaire
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dawType: '',
    dawProjectPath: '',
  });

  // Charger les projets
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await projectsService.getAll();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  // Créer un projet
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await projectsService.create(formData);
      setShowCreateForm(false);
      setFormData({ name: '', description: '', dawType: '', dawProjectPath: '' });
      await loadProjects();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du projet');
    }
  };

  // Mettre à jour un projet
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      setError('');
      await projectsService.update(editingProject.id, formData);
      setEditingProject(null);
      setFormData({ name: '', description: '', dawType: '', dawProjectPath: '' });
      await loadProjects();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du projet');
    }
  };

  // Supprimer un projet
  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    try {
      setError('');
      await projectsService.delete(id);
      await loadProjects();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression du projet');
    }
  };

  // Ouvrir le formulaire d'édition
  const startEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      dawType: project.dawType || '',
      dawProjectPath: project.dawProjectPath || '',
    });
    setShowCreateForm(true);
  };

  // Annuler l'édition/création
  const cancelForm = () => {
    setShowCreateForm(false);
    setEditingProject(null);
    setFormData({ name: '', description: '', dawType: '', dawProjectPath: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Chargement...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mes Projets</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          {showCreateForm ? 'Annuler' : 'Nouveau Projet'}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/15 text-destructive rounded-md">
          {error}
        </div>
      )}

      {/* Formulaire de création/édition */}
      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingProject ? 'Modifier le projet' : 'Nouveau projet'}</CardTitle>
            <CardDescription>
              {editingProject
                ? 'Modifiez les informations du projet'
                : 'Créez un nouveau projet musical'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingProject ? handleUpdate : handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du projet *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dawType">Type de DAW</Label>
                <Input
                  id="dawType"
                  value={formData.dawType}
                  onChange={(e) => setFormData({ ...formData, dawType: e.target.value })}
                  placeholder="ex: Ableton, Logic, etc."
                />
              </div>
              <div>
                <Label htmlFor="dawProjectPath">Chemin du projet DAW</Label>
                <Input
                  id="dawProjectPath"
                  value={formData.dawProjectPath}
                  onChange={(e) => setFormData({ ...formData, dawProjectPath: e.target.value })}
                  placeholder="/chemin/vers/projet.als"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingProject ? 'Modifier' : 'Créer'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelForm}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Liste des projets */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>Aucun projet pour le moment.</p>
            <p className="mt-2">Créez votre premier projet pour commencer !</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>
                  {project.description || 'Aucune description'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {project.dawType && (
                    <p className="text-sm text-muted-foreground">
                      DAW: {project.dawType}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Créé le: {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                  {project.tracks && (
                    <p className="text-sm text-muted-foreground">
                      {project.tracks.length} track(s)
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    Voir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(project)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

