import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Project } from 'src/entities/project.entity';
import { Track } from 'src/entities/track.entity';
import { Follow } from 'src/entities/follow.entity';
import { Like } from 'src/entities/like.entity';
import { Comment } from 'src/entities/comment.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    @InjectRepository(Follow)
    private followsRepository: Repository<Follow>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(email: string, password: string, name?: string): Promise<User> {
    const user = this.usersRepository.create({ email, password, name });
    return this.usersRepository.save(user);
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
  await this.usersRepository.update(id, updateData);
  const updatedUser = await this.findById(id);
  if (!updatedUser) {
    throw new NotFoundException('User not found');
  }
  return updatedUser;
}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
  async findByEmailVerificationToken(token: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
        where: { emailVerificationToken: token } 
    });
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { passwordResetToken: token } });
  }

  async findbyPasswordResetToken(token: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { passwordResetToken: token } });
  }

  async getProfile(userId: string, currentUserId?: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Récupérer les projets avec leurs tracks
    const projects = await this.projectsRepository.find({
      where: { userId },
      relations: ['tracks'],
      order: { createdAt: 'DESC' },
    });

    // Calculer les statistiques
    const projectIds = projects.map((p) => p.id);
    
    // Récupérer tous les tracks de tous les projets
    const allTracks = projectIds.length > 0
      ? await this.tracksRepository
          .createQueryBuilder('track')
          .where('track.projectId IN (:...projectIds)', { projectIds })
          .getMany()
      : [];
    
    const trackIds = allTracks.map((t) => t.id);

    const [followersCount, followingCount, totalLikes, totalComments] =
      await Promise.all([
        this.followsRepository.count({ where: { followingId: userId } }),
        this.followsRepository.count({ where: { followerId: userId } }),
        trackIds.length > 0
          ? this.likesRepository
              .createQueryBuilder('like')
              .where('like.trackId IN (:...trackIds)', { trackIds })
              .getCount()
          : 0,
        trackIds.length > 0
          ? this.commentsRepository
              .createQueryBuilder('comment')
              .where('comment.trackId IN (:...trackIds)', { trackIds })
              .getCount()
          : 0,
      ]);

    const totalTracks = allTracks.length;

    // Vérifier si l'utilisateur connecté suit ce profil
    let isFollowing = false;
    if (currentUserId && currentUserId !== userId) {
      const follow = await this.followsRepository.findOne({
        where: { followerId: currentUserId, followingId: userId },
      });
      isFollowing = !!follow;
    }

    // Préparer les projets avec leurs stats
    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const projectTracks = await this.tracksRepository.find({
          where: { projectId: project.id },
        });

        const trackIds = projectTracks.map((t) => t.id);
        
        let projectLikes = 0;
        let projectComments = 0;

        if (trackIds.length > 0) {
          projectLikes = await this.likesRepository
            .createQueryBuilder('like')
            .where('like.trackId IN (:...trackIds)', { trackIds })
            .getCount();

          projectComments = await this.commentsRepository
            .createQueryBuilder('comment')
            .where('comment.trackId IN (:...trackIds)', { trackIds })
            .getCount();
        }

        return {
          ...project,
          tracksCount: projectTracks.length,
          likesCount: projectLikes,
          commentsCount: projectComments,
          tracks: projectTracks,
        };
      }),
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      },
      stats: {
        followers: followersCount,
        following: followingCount,
        tracks: totalTracks,
        likes: totalLikes,
        comments: totalComments,
      },
      projects: projectsWithStats,
      isFollowing,
      isOwnProfile: currentUserId === userId,
    };
  }
}
