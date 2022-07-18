import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/users.entity';

describe('Auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AuthModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Users],
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

  describe('register', () => {
    it('registers users', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'email@email.com', password: 'password' })
        .expect(201);
    });

    it('returns a 400 if the request body is incorrectly formatted', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'email', password: '' })
        .expect({
          statusCode: 400,
          message: ['email must be an email', 'password should not be empty'],
          error: 'Bad Request'
        });
    });
  });

  describe('login', () => {
    it('logs in existing users', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'email@email.com', password: 'password' })
        .expect(201);
    });

    it('returns a 401 if logging in with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'email@email.com', password: 'wrongPassword' })
        .expect(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
