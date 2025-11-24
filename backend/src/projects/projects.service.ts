import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { error } from "console";
import { Project } from "src/entities/project.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
    ) {}

    async create(
        name: string,
        userId: string,
        description?: string,
        dawType?: string,
        dawProjectPath?: string,
    ): Promise<Project> {
        const project = this.projectsRepository.create({
            name,
            userId,
            description,
            dawType,
            dawProjectPath,
        });
        return this.projectsRepository.save(project);
    }

    async findByUser(userId: string): Promise<Project[]> {
        return this.projectsRepository.find({ where: { userId }});
    }
    async findOne(id: string, userId: string): Promise<Project | null> {
        return this.projectsRepository.findOne({ where: { id, userId } });
    }

    async update(id: string, userId, updateData: Partial<Project>): Promise<Project> {
        await this.projectsRepository.update({ id, userId}, updateData);
        const project= await this.findOne(id, userId);
        if (!project) {
            throw new error('Projects not found');
        }
        return project;
    }
    async delete(id: string, userId: string): Promise<void> {
        await this.projectsRepository.delete({ id, userId });
    }
}