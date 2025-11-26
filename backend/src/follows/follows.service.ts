import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from '../entities/follow.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class FollowsService {
    constructor(
        @InjectRepository(Follow)
        private followsRepository: Repository<Follow>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
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
    return this.followsRepository.save(follow);
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
