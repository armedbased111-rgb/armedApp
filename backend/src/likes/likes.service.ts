import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../entities/like.entity';
import { Track } from '../entities/track.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  async like(userId: string, trackId: string): Promise<Like> {
    // Vérifier que la track existe
    const track = await this.tracksRepository.findOne({ where: { id: trackId } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    // Vérifier si on a déjà liké cette track
    const existingLike = await this.likesRepository.findOne({
      where: { userId, trackId },
    });
    if (existingLike) {
      throw new BadRequestException('Already liked this track');
    }

    // Créer le like
    const like = this.likesRepository.create({ userId, trackId });
    const savedLike = await this.likesRepository.save(like);

    // Créer une notification pour le propriétaire de la track
    try {
      console.log('LikesService: Attempting to create notification', { userId, trackId });
      const notification = await this.notificationsService.createLikeNotification(userId, trackId);
      if (notification) {
        console.log('LikesService: Notification created successfully', { notificationId: notification.id });
      } else {
        console.log('LikesService: Notification creation returned null');
      }
    } catch (error) {
      // Ne pas faire échouer le like si la notification échoue
      console.error('LikesService: Error creating like notification:', error);
    }

    return savedLike;
  }

  async unlike(userId: string, trackId: string): Promise<void> {
    const like = await this.likesRepository.findOne({
      where: { userId, trackId },
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    await this.likesRepository.remove(like);
  }

  async isLiked(userId: string, trackId: string): Promise<boolean> {
    const like = await this.likesRepository.findOne({
      where: { userId, trackId },
    });
    return !!like;
  }

  async getLikesByTrack(trackId: string): Promise<Like[]> {
    return this.likesRepository.find({
      where: { trackId },
      relations: ['user'],
    });
  }

  async getLikesByUser(userId: string): Promise<Like[]> {
    return this.likesRepository.find({
      where: { userId },
      relations: ['track'],
    });
  }

  async getLikeCount(trackId: string): Promise<number> {
    return this.likesRepository.count({ where: { trackId } });
  }
}

