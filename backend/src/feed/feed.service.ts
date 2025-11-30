import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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

    // Inclure aussi l'utilisateur lui-même pour voir ses propres tracks
    const userIds = [...new Set([userId, ...followingIds])];

    console.log('Feed - User IDs:', userIds);

    // 2. Récupérer les projets de ces utilisateurs (y compris l'utilisateur lui-même)
    const projects = await this.projectsRepository
      .createQueryBuilder('project')
      .where('project.userId IN (:...userIds)', { userIds })
      .getMany();

    console.log('Feed - Projects found:', projects.length, projects.map(p => ({ id: p.id, name: p.name, userId: p.userId })));

    const projectIds = projects.map((p) => p.id);

    if (projectIds.length === 0) {
      console.log('Feed - No projects found, returning empty');
      return {
        tracks: [],
        total: 0,
        hasMore: false,
      };
    }

    console.log('Feed - Project IDs:', projectIds);

    // 3. Récupérer les tracks de ces projets
    // Utiliser le nom de la propriété projectId (TypeORM fait le mapping vers ProjectId)
    const tracks = await this.tracksRepository
      .createQueryBuilder('track')
      .where('track.projectId IN (:...projectIds)', { projectIds })
      .orderBy('track.createdAt', 'DESC')
      .take(limit)
      .skip(offset)
      .getMany();

    console.log('Feed - Raw tracks query result:', tracks.length);

    // 4. Charger les projets et users séparément pour éviter les problèmes de relations
    const projectsWithUsers = await this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.user', 'user')
      .where('project.id IN (:...projectIds)', { projectIds })
      .getMany();

    const projectMap = new Map(projectsWithUsers.map(p => [p.id, p]));

    // 5. Associer les projets aux tracks
    const tracksWithProjects = tracks.map(track => {
      const project = projectMap.get(track.projectId);
      return {
        ...track,
        project: project || null,
      };
    });

    console.log('Feed - Tracks found:', tracks.length);
    console.log('Feed - Projects with users:', projectsWithUsers.length);
    tracksWithProjects.forEach(t => {
      console.log('Track:', { id: t.id, name: t.name, projectId: t.projectId, hasProject: !!t.project, hasUser: !!(t.project?.user) });
    });

    // 6. Pour chaque track, récupérer les stats (likes, commentaires)
    const tracksWithStats = await Promise.all(
      tracksWithProjects.map(async (track) => {
        const [likeCount, commentCount, isLiked] = await Promise.all([
          this.likesRepository.count({ where: { trackId: track.id } }),
          this.commentsRepository.count({ where: { trackId: track.id } }),
          this.likesRepository.findOne({
            where: { trackId: track.id, userId },
          }),
        ]);

        // S'assurer que la structure correspond au format attendu par le frontend
        if (!track.project) {
          console.error('Track without project:', track.id);
          return null;
        }
        
        if (!track.project.user) {
          console.error('Project without user:', track.project.id);
          return null;
        }

        return {
          id: track.id,
          name: track.name,
          fileName: track.fileName,
          filePath: track.filePath,
          duration: track.duration,
          fileSize: track.fileSize,
          projectId: track.projectId,
          createdAt: track.createdAt,
          project: {
            id: track.project.id,
            name: track.project.name,
            userId: track.project.userId,
            user: {
              id: track.project.user.id,
              email: track.project.user.email,
              name: track.project.user.name,
              username: track.project.user.username,
              avatar: track.project.user.avatar,
            },
          },
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

    // Filtrer les tracks null (sans projet ou user)
    const validTracks = tracksWithStats.filter(t => t !== null);

    console.log('Feed - Valid tracks after filtering:', validTracks.length);

    return {
      tracks: validTracks,
      total: validTracks.length,
      hasMore: offset + limit < total,
    };
  }
}

