import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsertProjectDto, UpdateProjectDto } from './project.dto';
import { Projects } from './projects.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects)
    private projectsRepository: Repository<Projects>,
  ) {}

  async insertProject(project: InsertProjectDto) {
    await this.projectsRepository.insert(project);
  }

  async updateProject(project: UpdateProjectDto) { 
    await this.projectsRepository.update(project.id, project);
  }

  async getAll(): Promise<Projects[]> {
    return await this.projectsRepository.find();
  }
}
