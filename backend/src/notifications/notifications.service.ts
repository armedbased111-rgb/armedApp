import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from '../entities/notification.entity';
import { Track } from '../entities/track.entity';
import { Project } from '../entities/project.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    userId: string,
    type: NotificationType,
    actorId: string,
    targetId?: string,
  ): Promise<Notification | null> {
    // Ne pas créer de notification si l'utilisateur se notifie lui-même
    if (userId === actorId) {
      console.log('Notification: Skipping self-notification', { userId, actorId, type });
      return null;
    }

    try {
      const notification = this.notificationsRepository.create({
        userId,
        type,
        actorId,
        targetId: targetId || null,
      });

      const saved = await this.notificationsRepository.save(notification);
      console.log('Notification: Created successfully', {
        id: saved.id,
        type: saved.type,
        userId: saved.userId,
        actorId: saved.actorId,
      });
      return saved;
    } catch (error) {
      console.error('Notification: Error creating notification', {
        userId,
        type,
        actorId,
        targetId,
        error: error.message,
      });
      return null;
    }
  }

  async getByUser(
    userId: string,
    limit: number = 20,
    offset: number = 0,
    unreadOnly: boolean = false,
  ): Promise<{ notifications: Notification[]; total: number }> {
    const queryBuilder = this.notificationsRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.actor', 'actor')
      .leftJoinAndSelect('notification.target', 'target')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC');

    if (unreadOnly) {
      queryBuilder.andWhere('notification.read = :read', { read: false });
    }

    const [notifications, total] = await queryBuilder
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    console.log('NotificationsService.getByUser: Found notifications', {
      userId,
      count: notifications.length,
      total,
      unreadOnly,
    });

    return { notifications, total };
  }

  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.read = true;
    return this.notificationsRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsRepository.update(
      { userId, read: false },
      { read: true },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationsRepository.count({
      where: { userId, read: false },
    });
  }

  // Méthode utilitaire pour créer une notification de LIKE
  async createLikeNotification(actorId: string, trackId: string): Promise<Notification | null> {
    // Charger la track
    const track = await this.tracksRepository.findOne({
      where: { id: trackId },
    });

    if (!track) {
      console.error('Notification LIKE: Track not found', { trackId });
      return null;
    }

    // Charger le projet avec l'utilisateur
    const project = await this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.user', 'user')
      .where('project.id = :projectId', { projectId: track.projectId })
      .getOne();

    if (!project || !project.user) {
      console.error('Notification LIKE: Project or user not found', {
        trackId,
        projectId: track.projectId,
        hasProject: !!project,
        hasUser: !!project?.user,
      });
      return null;
    }

    const trackOwnerId = project.user.id;
    console.log('Notification LIKE: Creating notification', {
      actorId,
      trackId,
      trackOwnerId,
    });
    return this.create(trackOwnerId, NotificationType.LIKE, actorId, trackId);
  }

  // Méthode utilitaire pour créer une notification de COMMENT
  async createCommentNotification(actorId: string, trackId: string): Promise<Notification | null> {
    // Charger la track
    const track = await this.tracksRepository.findOne({
      where: { id: trackId },
    });

    if (!track) {
      console.error('Notification COMMENT: Track not found', { trackId });
      return null;
    }

    // Charger le projet avec l'utilisateur
    const project = await this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.user', 'user')
      .where('project.id = :projectId', { projectId: track.projectId })
      .getOne();

    if (!project || !project.user) {
      console.error('Notification COMMENT: Project or user not found', {
        trackId,
        projectId: track.projectId,
        hasProject: !!project,
        hasUser: !!project?.user,
      });
      return null;
    }

    const trackOwnerId = project.user.id;
    console.log('Notification COMMENT: Creating notification', {
      actorId,
      trackId,
      trackOwnerId,
    });
    return this.create(trackOwnerId, NotificationType.COMMENT, actorId, trackId);
  }

  // Méthode utilitaire pour créer une notification de FOLLOW
  async createFollowNotification(actorId: string, followingId: string): Promise<Notification | null> {
    return this.create(followingId, NotificationType.FOLLOW, actorId);
  }
}

