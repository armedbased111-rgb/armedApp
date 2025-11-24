import { Body, Controller, Delete, Post, Get, Query, Param, } from "@nestjs/common";
import { TracksService } from "./tracks.service";
import { Track } from "src/entities/track.entity";
import { Project } from "src/entities/project.entity";
import { error } from "console";

@Controller('tracks')
export class TracksController{
    constructor(private readonly tracksService: TracksService) {}
    @Post()
    async create(
        @Body() createTrackDto: {
            name: string;
            projectId: string;
            filename: string;
            filePath: string;
            duration?: number;
            fileSize?: number;
        },
    ): Promise<Track> {
        return this.tracksService.create(
            createTrackDto.name,
            createTrackDto.projectId,
            createTrackDto.filename,
            createTrackDto.filePath,
            createTrackDto.duration,
            createTrackDto.fileSize,
        );
    }

    @Get()
    async findAll(@Query('projectId') ProjectId: string): Promise<Track[]> {
        return this.tracksService.findByProject(ProjectId);
    }

    @Get('id')
    async findOne(@Param('id') id: string): Promise<Track> {
        const track = await this.tracksService.findOne(id);
         if (!track) {
        throw new error('Track Not found')
         }
         return track;
    }
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.tracksService.delete(id);
    }
}