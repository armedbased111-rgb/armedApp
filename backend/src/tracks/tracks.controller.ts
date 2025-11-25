import {
  Body,
  Controller,
  Delete,
  Post,
  Get,
  Query,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { Track } from 'src/entities/track.entity';
import { Project } from 'src/entities/project.entity';
import { error } from 'console';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('tracks')
@UseGuards(JwtAuthGuard)
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}
  @Post()
  async create(
    @Body()
    createTrackDto: {
      name: string;
      filename: string;
      filePath: string;
      duration?: number;
      fileSize?: number;
    },
    @Request() req,
  ): Promise<Track> {
    return this.tracksService.create(
      createTrackDto.name,
      req.project.projectId,
      createTrackDto.filename,
      createTrackDto.filePath,
      createTrackDto.duration,
      createTrackDto.fileSize,
    );
  }

  @Get()
  async findAll(@Request() req): Promise<Track[]> {
    return this.tracksService.findByProject(req.project.projectId);
  }

  @Get('id')
  async findOne(@Param('id') id: string): Promise<Track> {
    const track = await this.tracksService.findOne(id);
    if (!track) {
      throw new error('Track Not found');
    }
    return track;
  }
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.tracksService.delete(id);
  }
}
