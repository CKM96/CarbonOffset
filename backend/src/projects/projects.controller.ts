import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InsertProjectDto, UpdateProjectDto } from './project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async insert(@Body() project: InsertProjectDto) {
    await this.projectsService.insertProject(project);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Body() project: UpdateProjectDto) {
    await this.projectsService.updateProject(project);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return await this.projectsService.getAll();
  }
}
