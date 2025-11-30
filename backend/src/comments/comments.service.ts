import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Track } from '../entities/track.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  async create(userId: string, trackId: string, content: string): Promise<Comment> {
    // Vérifier que la track existe
    const track = await this.tracksRepository.findOne({ where: { id: trackId } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    // Vérifier que le contenu n'est pas vide
    if (!content || content.trim().length === 0) {
      throw new ForbiddenException('Comment content cannot be empty');
    }

    // Créer le commentaire
    const comment = this.commentsRepository.create({
      userId,
      trackId,
      content: content.trim(),
    });
    const savedComment = await this.commentsRepository.save(comment);

    // Créer une notification pour le propriétaire de la track
    try {
      console.log('CommentsService: Attempting to create notification', { userId, trackId });
      const notification = await this.notificationsService.createCommentNotification(userId, trackId);
      if (notification) {
        console.log('CommentsService: Notification created successfully', { notificationId: notification.id });
      } else {
        console.log('CommentsService: Notification creation returned null');
      }
    } catch (error) {
      // Ne pas faire échouer le commentaire si la notification échoue
      console.error('CommentsService: Error creating comment notification:', error);
    }

    return savedComment;
  }

  async update(commentId: string, userId: string, content: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Vérifier que l'utilisateur est le propriétaire du commentaire
    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    // Vérifier que le contenu n'est pas vide
    if (!content || content.trim().length === 0) {
      throw new ForbiddenException('Comment content cannot be empty');
    }

    comment.content = content.trim();
    return this.commentsRepository.save(comment);
  }

  async delete(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Vérifier que l'utilisateur est le propriétaire du commentaire
    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentsRepository.remove(comment);
  }

  async getByTrack(trackId: string): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { trackId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getById(commentId: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
      relations: ['user', 'track'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async getCommentCount(trackId: string): Promise<number> {
    return this.commentsRepository.count({ where: { trackId } });
  }
}

