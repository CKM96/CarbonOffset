require('dotenv').config();

import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { ProjectModule } from './project.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { JwtService } from '@nestjs/jwt';

const TEST_USER = {
  id: 'id',
  email: 'email@email.com',
};

const TEST_INSERT_PROJECT_BODY = {
  accountId: '86a44927-e219-4871-8264-2b1e51d52b21',
  name: 'Name',
  description: 'Description',
};

const TEST_UPDATE_PROJECT_BODY = {
  id: `f75b9d49-2a22-4578-ae1e-32132e77a4d8`,
  name: 'Name',
  description: 'Description',
};

describe('Project', () => {
  let app: INestApplication;

  const token = new JwtService({ secret: process.env.JWT_SECRET }).sign({
    username: TEST_USER.email,
    sub: TEST_USER.id,
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ProjectModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Project],
          dropSchema: true,
          synchronize: true,
          logging: false,
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('getAll', () => {
    it('returns a 200 on success', () => {
      return request(app.getHttpServer())
        .get('/projects')
        .auth(token, { type: 'bearer' })
        .expect(200);
    });

    it('returns a 401 if a valid token is not provided', () => {
      return request(app.getHttpServer()).get('/projects').expect(401);
    });
  });

  describe('insert', () => {
    it('returns a 201 on success', () => {
      return request(app.getHttpServer())
        .post('/projects')
        .auth(token, { type: 'bearer' })
        .send(TEST_INSERT_PROJECT_BODY)
        .expect(201);
    });

    it('returns a 400 if the request body is incorrectly formatted', () => {
      return request(app.getHttpServer())
        .post('/projects')
        .auth(token, { type: 'bearer' })
        .send({ accountId: 'notAUuid', name: '' })
        .expect({
          statusCode: 400,
          message: ['accountId must be a UUID', 'name should not be empty'],
          error: 'Bad Request',
        });
    });

    it('returns a 401 if a valid token is not provided', () => {
      return request(app.getHttpServer())
        .post('/projects')
        .send(TEST_INSERT_PROJECT_BODY)
        .expect(401);
    });
  });

  describe('update', () => {
    it('returns a 200 on success', () => {
      return request(app.getHttpServer())
        .put('/projects')
        .auth(token, { type: 'bearer' })
        .send(TEST_UPDATE_PROJECT_BODY)
        .expect(200);
    });

    it('returns a 400 if the request body is incorrectly formatted', () => {
      return request(app.getHttpServer())
        .put('/projects')
        .auth(token, { type: 'bearer' })
        .send({ id: 'notAUuid' })
        .expect({
          statusCode: 400,
          message: ['id must be a UUID'],
          error: 'Bad Request',
        });
    });

    it('returns a 401 if a valid token is not provided', () => {
      return request(app.getHttpServer())
        .put('/projects')
        .send(TEST_UPDATE_PROJECT_BODY)
        .expect(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
