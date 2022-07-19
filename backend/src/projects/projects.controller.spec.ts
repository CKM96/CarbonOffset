import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { Projects } from './projects.entity';
import { ProjectsService } from './projects.service';

describe('ProjectsController', () => {
  it('getAll should return all projects', async () => {
    const project1 = {
      id: 'id',
      user_id: 'user_id',
      name: 'name',
      description: 'description',
      date_created: Date.now(),
    };
    const project2 = {
      id: 'id2',
      user_id: 'user_id2',
      name: 'name2',
      description: 'description2',
      date_created: Date.now(),
    };
    const findMock = jest.fn(() => [project1, project2]);
    const controller = await setupTest({ findMock });
    
    const projects = await controller.getAll();

    expect(projects).toEqual([project1, project2]);
    expect(findMock).toHaveBeenCalled();
  });

  it('insert should add new projects', async () => {
    const insertMock = jest.fn();
    const projectData = { user_id: 'userId', name: 'name', description: 'description' };
    const controller = await setupTest({ insertMock });

    await controller.insert(projectData);

    expect(insertMock).toHaveBeenCalledWith(projectData);
  });

  it('update should updaste existing projects', async () => {
    const updateMock = jest.fn();
    const projectData = { id: 'id', name: 'name', description: 'description' };
    const controller = await setupTest({ updateMock });

    await controller.update(projectData);

    expect(updateMock).toHaveBeenCalledWith("id", projectData);
  });
});

async function setupTest({
  findMock = jest.fn(),
  insertMock = jest.fn(),
  updateMock = jest.fn(),
} = {}) {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [ProjectsController],
    providers: [
      ProjectsService,
      {
        provide: getRepositoryToken(Projects),
        useValue: { find: findMock, insert: insertMock, update: updateMock },
      },
    ],
  }).compile();

  return module.get<ProjectsController>(ProjectsController);
}
