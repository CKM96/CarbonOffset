import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InsertProjectDto, UpdateProjectDto } from './project.dto';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async insert(@Body() project: InsertProjectDto, @Request() request) {
    await this.projectService.insertProject(request.user.accountId, project);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Body() project: UpdateProjectDto) {
    await this.projectService.updateProject(project);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return await this.projectService.getAll();
  }
}
