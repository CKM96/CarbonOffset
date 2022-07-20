import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { Project } from './project.entity';
import { ProjectController } from './project.controller';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  providers: [ProjectService, JwtStrategy],
  exports: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
