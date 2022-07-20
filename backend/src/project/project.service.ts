import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsertProjectDto, UpdateProjectDto } from './project.dto';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async insertProject(project: InsertProjectDto) {
    await this.projectsRepository.insert(project);
  }

  async updateProject(project: UpdateProjectDto) { 
    await this.projectsRepository.update(project.id, project);
  }

  async getAll(): Promise<Project[]> {
    return await this.projectsRepository.find();
  }
}
