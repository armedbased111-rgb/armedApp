import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User } from '../entities/user.entity';
import { Track } from '../entities/track.entity';
import { Project } from '../entities/project.entity';

export interface SearchResult {
  users: User[];
  tracks: (Track & { project?: Project & { user?: User } })[];
  projects: (Project & { user?: User; tracksCount?: number })[];
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async search(query: string, limit: number = 20): Promise<SearchResult> {
    if (!query || query.trim().length === 0) {
      return {
        users: [],
        tracks: [],
        projects: [],
      };
    }

    const searchTerm = `%${query.trim()}%`;

    // Recherche d'utilisateurs (username, name, email)
    const users = await this.usersRepository.find({
      where: [
        { username: ILike(searchTerm) },
        { name: ILike(searchTerm) },
        { email: ILike(searchTerm) },
      ],
      take: limit,
      order: { createdAt: 'DESC' },
    });

    // Recherche de tracks (par nom)
    const tracks = await this.tracksRepository
      .createQueryBuilder('track')
      .leftJoinAndSelect('track.project', 'project')
      .leftJoinAndSelect('project.user', 'user')
      .where('track.name ILIKE :searchTerm', { searchTerm })
      .orderBy('track.createdAt', 'DESC')
      .take(limit)
      .getMany();

    // Recherche de projets (par nom et description)
    const projects = await this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.user', 'user')
      .leftJoin('project.tracks', 'track')
      .addSelect('COUNT(track.id)', 'tracksCount')
      .where('project.name ILIKE :searchTerm', { searchTerm })
      .orWhere('project.description ILIKE :searchTerm', { searchTerm })
      .groupBy('project.id')
      .addGroupBy('user.id')
      .orderBy('project.createdAt', 'DESC')
      .take(limit)
      .getRawAndEntities();

    // Mapper les résultats pour inclure tracksCount
    const projectsWithCount = projects.entities.map((project, index) => ({
      ...project,
      tracksCount: parseInt(projects.raw[index]?.tracksCount || '0', 10),
    }));

    return {
      users,
      tracks,
      projects: projectsWithCount,
    };
  }

  async searchUsers(query: string, limit: number = 20): Promise<User[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchTerm = `%${query.trim()}%`;

    return this.usersRepository.find({
      where: [
        { username: ILike(searchTerm) },
        { name: ILike(searchTerm) },
        { email: ILike(searchTerm) },
      ],
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async searchTracks(
    query: string,
    limit: number = 20,
  ): Promise<(Track & { project?: Project & { user?: User } })[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchTerm = `%${query.trim()}%`;

    return this.tracksRepository
      .createQueryBuilder('track')
      .leftJoinAndSelect('track.project', 'project')
      .leftJoinAndSelect('project.user', 'user')
      .where('track.name ILIKE :searchTerm', { searchTerm })
      .orderBy('track.createdAt', 'DESC')
      .take(limit)
      .getMany();
  }

  async searchProjects(
    query: string,
    limit: number = 20,
  ): Promise<(Project & { user?: User; tracksCount?: number })[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchTerm = `%${query.trim()}%`;

    const projects = await this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.user', 'user')
      .leftJoin('project.tracks', 'track')
      .addSelect('COUNT(track.id)', 'tracksCount')
      .where('project.name ILIKE :searchTerm', { searchTerm })
      .orWhere('project.description ILIKE :searchTerm', { searchTerm })
      .groupBy('project.id')
      .addGroupBy('user.id')
      .orderBy('project.createdAt', 'DESC')
      .take(limit)
      .getRawAndEntities();

    return projects.entities.map((project, index) => ({
      ...project,
      tracksCount: parseInt(projects.raw[index]?.tracksCount || '0', 10),
    }));
  }
}

