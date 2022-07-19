import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { InsertProjectDto, UpdateProjectDto } from './project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async insert(@Body() project: InsertProjectDto) {
    await this.projectsService.insertProject(project);
  }

  @Put()
  async update(@Body() project: UpdateProjectDto) {
    await this.projectsService.updateProject(project);
  }

  @Get()
  async getProjects() {
    return await this.projectsService.getAll();
  }
}
