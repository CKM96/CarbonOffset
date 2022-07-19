import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { Projects } from './projects.entity';
import { ProjectsController } from './projects.controller';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Projects])],
  providers: [ProjectsService, JwtStrategy],
  exports: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
