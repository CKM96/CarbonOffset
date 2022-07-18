import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../users/users.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

beforeEach(jest.clearAllMocks);

describe('AuthController', () => {
  describe('login', () => {
    it('generates a JWT', async () => {
      const signMock = jest.fn(() => 'accessToken');

      const authController = await setupTest({ signMock });

      const token = await authController.login({
        user: { email: 'Email', id: 'Id' },
      });

      expect(token).toEqual({ accessToken: 'accessToken' });
      expect(signMock).toHaveBeenCalledWith({ username: 'Email', sub: 'Id' });
    });
  });

  describe('register', () => {
    it('creates a user if none exists', async () => {
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashedPassword');
      const signMock = jest.fn(() => 'accessToken');
      const insertMock = jest.fn(() => ({
        identifiers: [{ id: 'generatedId' }],
      }));

      const authController = await setupTest({ signMock, insertMock });

      const token = await authController.register({
        email: 'Email',
        password: 'Password',
      });

      expect(token).toEqual({ accessToken: 'accessToken' });
      expect(insertMock).toHaveBeenCalledWith({
        email: 'Email',
        password_hash: 'hashedPassword',
      });
      expect(signMock).toHaveBeenCalledWith({
        username: 'Email',
        sub: 'generatedId',
      });
    });

    it('returns a 409 if a user already exists', async () => {
      const insertMock = jest
        .fn()
        .mockRejectedValue(
          new Error(
            'duplicate key value violates unique constraint "users_email_key"',
          ),
        );

      const authController = await setupTest({ insertMock });

      await expect(() =>
        authController.register({
          email: 'Email',
          password: 'Password',
        }),
      ).rejects.toThrow(
        new HttpException('User already registered', HttpStatus.CONFLICT),
      );
    });

    it('returns a 500 for generic errors', async () => {
      jest.spyOn(bcrypt, 'hashSync').mockImplementation(() => {
        throw new Error('Hashing error');
      });

      const authController = await setupTest();

      await expect(() =>
        authController.register({
          email: 'Email',
          password: 'Password',
        }),
      ).rejects.toThrow(
        new HttpException('Hashing error', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });
});

async function setupTest({
  signMock = jest.fn(),
  insertMock = jest.fn(),
} = {}) {
  const app: TestingModule = await Test.createTestingModule({
    controllers: [AuthController],
    providers: [
      AuthService,
      UsersService,
      {
        provide: JwtService,
        useValue: {
          sign: signMock,
        },
      },
      {
        provide: getRepositoryToken(Users),
        useValue: { insert: insertMock },
      },
    ],
  }).compile();

  return app.get<AuthController>(AuthController);
}
