import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { commentsService, type Comment } from '../services/comments';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Send, Trash2, Edit2 } from 'lucide-react';
// Fonction pour formater la date en "il y a X temps"
const formatTimeAgo = (date: string) => {
  const now = new Date();
  const commentDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'à l\'instant';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  }
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  }
  return commentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

interface CommentsDialogProps {
  trackId: string;
  trackName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCommentAdded?: () => void;
}

export function CommentsDialog({
  trackId,
  trackName,
  open,
  onOpenChange,
  onCommentAdded,
}: CommentsDialogProps) {
  const { user: currentUser } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (open && trackId) {
      loadComments();
    }
  }, [open, trackId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const data = await commentsService.getByTrack(trackId);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      await commentsService.create(trackId, content.trim());
      setContent('');
      await loadComments();
      onCommentAdded?.();
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) {
      setEditingId(null);
      return;
    }

    try {
      await commentsService.update(commentId, editContent.trim());
      setEditingId(null);
      setEditContent('');
      await loadComments();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      return;
    }

    try {
      await commentsService.delete(commentId);
      await loadComments();
      onCommentAdded?.();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const getUserDisplayName = (comment: Comment) => {
    return comment.user?.name || comment.user?.username || comment.user?.email || 'Utilisateur';
  };

  const getUserInitials = (comment: Comment) => {
    const name = getUserDisplayName(comment);
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Commentaires - {trackName}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Liste des commentaires */}
          <ScrollArea className="flex-1 pr-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Chargement des commentaires...
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun commentaire pour le moment. Soyez le premier à commenter !
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      {comment.user?.avatar && (
                        <AvatarImage src={comment.user.avatar} alt={getUserDisplayName(comment)} />
                      )}
                      <AvatarFallback>
                        {comment.user?.avatar ? (
                          <User className="h-4 w-4" />
                        ) : (
                          getUserInitials(comment)
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      {editingId === comment.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[80px]"
                            placeholder="Modifier votre commentaire..."
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleEdit(comment.id)}
                              disabled={!editContent.trim()}
                            >
                              Enregistrer
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEdit}>
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm">
                                {getUserDisplayName(comment)}
                              </p>
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                                {comment.content}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatTimeAgo(comment.createdAt)}
                                {comment.updatedAt !== comment.createdAt && ' (modifié)'}
                              </p>
                            </div>
                            {currentUser?.id === comment.userId && (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={() => startEdit(comment)}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                  onClick={() => handleDelete(comment.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Formulaire d'ajout de commentaire */}
          <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t">
            <div className="flex gap-2">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="flex-1 min-h-[80px]"
                disabled={submitting}
              />
              <Button type="submit" disabled={!content.trim() || submitting} className="self-end">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

