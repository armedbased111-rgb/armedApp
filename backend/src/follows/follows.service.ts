import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from '../entities/follow.entity';
import { User } from '../entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FollowsService {
    constructor(
        @InjectRepository(Follow)
        private followsRepository: Repository<Follow>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @Inject(forwardRef(() => NotificationsService))
        private notificationsService: NotificationsService,
    ) {}

      async follow(followerId: string, followingId: string): Promise<Follow> {
    // Vérifier qu'on ne se suit pas soi-même
    if (followerId === followingId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    // Vérifier que l'utilisateur à suivre existe
    const userToFollow = await this.usersRepository.findOne({ where: { id: followingId } });
    if (!userToFollow) {
      throw new NotFoundException('User to follow not found');
    }

    // Vérifier si on suit déjà cet utilisateur
    const existingFollow = await this.followsRepository.findOne({
      where: { followerId, followingId },
    });
    if (existingFollow) {
      throw new BadRequestException('Already following this user');
    }

    // Créer la relation
    const follow = this.followsRepository.create({ followerId, followingId });
    const savedFollow = await this.followsRepository.save(follow);

    // Créer une notification pour l'utilisateur suivi
    try {
      await this.notificationsService.createFollowNotification(followerId, followingId);
    } catch (error) {
      // Ne pas faire échouer le follow si la notification échoue
      console.error('Error creating follow notification:', error);
    }

    return savedFollow;
  }

    async unfollow(followerId: string, followingId: string): Promise<void> {
    const follow = await this.followsRepository.findOne({
      where: { followerId, followingId },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    await this.followsRepository.remove(follow);
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.followsRepository.findOne({
        where: { followerId, followingId },
    });
    return !!follow;
  }
  async getFollowers(userId: string): Promise<Follow[]> {
    return this.followsRepository.find({
        where: { followingId: userId },
        relations: ['follower'],
    });
  }

  async getFollowing(userId: string): Promise<Follow[]> {
    return this.followsRepository.find({
        where: { followerId: userId },
        relations: ['following'],
    });
  }

}
