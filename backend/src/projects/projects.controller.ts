import { Controller, Post, Body, Get, Query, Param, Put, Delete } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { Project } from "src/entities/project.entity";
import { error } from "console";

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post()
    async create(
        @Body() createProjectDto: {
            name: string;
            userId: string;
            description?: string;
            dawType?: string;
            dawProjectPath?: string;
        },
    ): Promise<Project> {
        return this.projectsService.create(
            createProjectDto.name,
            createProjectDto.userId,
            createProjectDto.description,
            createProjectDto.dawType,
            createProjectDto.dawProjectPath,
        );
    }
    @Get()
    async findAll(@Query('userId') userId: string): Promise<Project[]> {
        return this.projectsService.findByUser(userId);
    }
    @Get(':id')
    async findOne(@Param('id') id: string, @Query('userId') userId: string): Promise<Project> {
        const project = await this.projectsService.findOne(id, userId);
        if (!project) {
            throw new error('Project Not Found..')
        }
        return project;
    }

    @Put('id')
    async update(
        @Param('id') id: string,
        @Query('userId') userId: string,
        @Body() updateProjectDto: Partial<Project>,
    ): Promise<Project> {
        return this.projectsService.update(id, userId, updateProjectDto)
    }
    @Delete('id')
    async delete(@Param('id') id: string, @Query('userId') userId: string): Promise<void> {
        return this.projectsService.delete(id, userId);
    }
}