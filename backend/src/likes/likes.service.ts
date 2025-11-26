import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../entities/like.entity';
import { Track } from '../entities/track.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
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
    return this.likesRepository.save(like);
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

