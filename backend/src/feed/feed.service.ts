import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from '../entities/track.entity';
import { Project } from '../entities/project.entity';
import { Follow } from '../entities/follow.entity';
import { Like } from '../entities/like.entity';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Follow)
    private followsRepository: Repository<Follow>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async getFeed(userId: string, limit: number = 20, offset: number = 0) {
    // 1. Récupérer les IDs des utilisateurs suivis
    const follows = await this.followsRepository.find({
      where: { followerId: userId },
    });
    const followingIds = follows.map((follow) => follow.followingId);

    // Si l'utilisateur ne suit personne, retourner un tableau vide
    if (followingIds.length === 0) {
      return {
        tracks: [],
        total: 0,
        hasMore: false,
      };
    }

    // 2. Récupérer les projets de ces utilisateurs
    const projects = await this.projectsRepository
      .createQueryBuilder('project')
      .where('project.userId IN (:...userIds)', { userIds: followingIds })
      .getMany();

    const projectIds = projects.map((p) => p.id);

    if (projectIds.length === 0) {
      return {
        tracks: [],
        total: 0,
        hasMore: false,
      };
    }

    // 3. Récupérer les tracks de ces projets avec les relations
    const tracks = await this.tracksRepository
      .createQueryBuilder('track')
      .leftJoinAndSelect('track.project', 'project')
      .leftJoinAndSelect('project.user', 'user')
      .where('track.projectId IN (:...projectIds)', { projectIds })
      .orderBy('track.createdAt', 'DESC')
      .take(limit)
      .skip(offset)
      .getMany();

    // 4. Pour chaque track, récupérer les stats (likes, commentaires)
    const tracksWithStats = await Promise.all(
      tracks.map(async (track) => {
        const [likeCount, commentCount, isLiked] = await Promise.all([
          this.likesRepository.count({ where: { trackId: track.id } }),
          this.commentsRepository.count({ where: { trackId: track.id } }),
          this.likesRepository.findOne({
            where: { trackId: track.id, userId },
          }),
        ]);

        return {
          ...track,
          likeCount,
          commentCount,
          isLiked: !!isLiked,
        };
      }),
    );

    // 5. Compter le total pour la pagination
    const total = await this.tracksRepository
      .createQueryBuilder('track')
      .where('track.projectId IN (:...projectIds)', { projectIds })
      .getCount();

    return {
      tracks: tracksWithStats,
      total,
      hasMore: offset + limit < total,
    };
  }
}

