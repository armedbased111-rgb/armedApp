import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from "./projects.service";
import { Project } from "src/entities/project.entity";
import { error } from "console";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post()
    async create(
        @Body() createProjectDto: {
            name: string;
            description?: string;
            dawType?: string;
            dawProjectPath?: string;
        },
        @Request() req,
    ): Promise<Project> {
        return this.projectsService.create(
            createProjectDto.name,
            req.user.userId,
            createProjectDto.description,
            createProjectDto.dawType,
            createProjectDto.dawProjectPath,
        );
    }
    @Get()
    async findAll(@Request() req): Promise<Project[]> {
        return this.projectsService.findByUser(req.user.userId);
    }
    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req): Promise<Project> {
        const project = await this.projectsService.findOne(id, req.user.userId);
        if (!project) {
            throw new error('Project Not Found')
        }
        return project;
    }

    @Put('id')
    async update(
        @Param('id') id: string,
        @Request() req,
        @Body() updateProjectDto: Partial<Project>,
    ): Promise<Project> {
        return this.projectsService.update(id, req.user.userId, updateProjectDto)
    }
    @Delete('id')
    async delete(@Param('id') id: string, @Request() req): Promise<void> {
        return this.projectsService.delete(id, req.user.userId);
    }
}