import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

beforeEach(jest.clearAllMocks);

describe('UsersController', () => {
  describe('root', () => {
    it('creates a user if none exists', async () => {
      jest.spyOn(bcrypt, 'hash').mockImplementation((_, __, callback) => {
        callback(undefined, 'hashedPassword');
      });

      const findOneByMock = jest.fn(() => undefined);
      const insertMock = jest.fn();

      const app: TestingModule = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [
          UsersService,
          {
            provide: getRepositoryToken(Users),
            useValue: {
              findOneBy: findOneByMock,
              insert: insertMock,
            },
          },
        ],
      }).compile();

      const usersController = app.get<UsersController>(UsersController);

      await usersController.createUser({
        email: 'Email',
        password: 'Password',
      });

      expect(findOneByMock).toHaveBeenCalledWith({ email: 'Email' });
      expect(insertMock).toHaveBeenCalledWith({
        email: 'Email',
        password_hash: 'hashedPassword',
      });
    });

    it('throws an error if a user already exists', async () => {
      const findOneByMock = jest.fn(() => ({
        email: 'Email',
        password_hash: 'hashedPassword',
      }));
      const insertMock = jest.fn();

      const app: TestingModule = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [
          UsersService,
          {
            provide: getRepositoryToken(Users),
            useValue: {
              findOneBy: findOneByMock,
              insert: insertMock,
            },
          },
        ],
      }).compile();

      const usersController = app.get<UsersController>(UsersController);

      await expect(() =>
        usersController.createUser({
          email: 'Email',
          password: 'Password',
        }),
      ).rejects.toThrow(
        new HttpException('User already registered', HttpStatus.CONFLICT),
      );

      expect(findOneByMock).toHaveBeenCalledWith({ email: 'Email' });
      expect(insertMock).not.toHaveBeenCalled();
    });

    it('logs any errors that arise from hashing', async () => {
      jest.spyOn(bcrypt, 'hash').mockImplementation((_, __, callback) => {
        callback(new Error('Hash error!'), 'hashedPassword');
      });
      console.error = jest.fn();

      const findOneByMock = jest.fn(() => undefined);
      const insertMock = jest.fn();

      const app: TestingModule = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [
          UsersService,
          {
            provide: getRepositoryToken(Users),
            useValue: {
              findOneBy: findOneByMock,
              insert: insertMock,
            },
          },
        ],
      }).compile();

      const usersController = app.get<UsersController>(UsersController);

      await usersController.createUser({
        email: 'Email',
        password: 'Password',
      });

      expect(console.error).toHaveBeenCalledWith(new Error('Hash error!'));
      expect(findOneByMock).toHaveBeenCalledWith({ email: 'Email' });
      expect(insertMock).not.toHaveBeenCalled();
    });
  });
});
