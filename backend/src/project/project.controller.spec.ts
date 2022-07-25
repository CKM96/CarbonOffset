import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { Project } from './project.entity';
import { ProjectService } from './project.service';

describe('ProjectsController', () => {
  it('getAll should return all projects', async () => {
    const project1 = {
      id: 'id',
      accountId: 'accountId',
      name: 'name',
      description: 'description',
    };
    const project2 = {
      id: 'id2',
      accountId: 'accountId2',
      name: 'name2',
      description: 'description2',
    };
    const findMock = jest.fn(() => [project1, project2]);
    const controller = await setupTest({ findMock });
    
    const projects = await controller.getAll();

    expect(projects).toEqual([project1, project2]);
    expect(findMock).toHaveBeenCalled();
  });

  it('insert should add new projects', async () => {
    const insertMock = jest.fn();
    const projectData = { name: 'name', description: 'description' };
    const controller = await setupTest({ insertMock });

    await controller.insert(projectData, { user: { accountId: 'accountId' } });

    expect(insertMock).toHaveBeenCalledWith({ accountId: 'accountId', ...projectData });
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
    controllers: [ProjectController],
    providers: [
      ProjectService,
      {
        provide: getRepositoryToken(Project),
        useValue: { find: findMock, insert: insertMock, update: updateMock },
      },
    ],
  }).compile();

  return module.get<ProjectController>(ProjectController);
}
