import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from 'src/entities/track.entity';

@Injectable()
export class TracksService {
    constructor(
        @InjectRepository(Track)
        private tracksRepository: Repository<Track>,
    ) {}

    async create(
        name: string,
        projectId: string,
        fileName: string,
        filePath: string,
        duration?: number,
        fileSize?: number,
    ): Promise<Track> {
        const track = this.tracksRepository.create({
            name,
            projectId,
            fileName,
            filePath,
            duration,
            fileSize,
        });
        return this.tracksRepository.save(track)
    }
    async findByProject(projectId: string): Promise<Track[]> {
        return this.tracksRepository.find({ where: { projectId } });
    }
    async findOne(id: string): Promise<Track | null> {
        return this.tracksRepository.findOne({ where: { id } });
    }
    async delete(id: string): Promise<void> {
        await this.tracksRepository.delete(id);
    }
}