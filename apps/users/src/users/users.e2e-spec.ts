import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from '@app/core/core.module';
import { INestApplication } from '@nestjs/common';
import { User } from '@app/users/prisma-client';
import request from 'supertest';
import { UsersPrismaService } from '../users-prisma/services/users-prisma.service';
import { UsersModule } from './users.module';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let prisma: UsersPrismaService;
  const validUserData = {
    email: 'users-e2e@email-test.com',
    password: 'usersE2ePass!',
  };
  let createdUser: User;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<UsersPrismaService>(UsersPrismaService);
  });
  beforeAll(async () => {
    createdUser = await prisma.user.create({
      data: validUserData,
    });
  });

  describe('POST /', () => {
    const createRequest = (data: any) => {
      const agent = request.agent(app.getHttpServer());
      return agent.post('/users').send(data);
    };
    it('should return validation error for email', async () => {
      const data = {
        email: 'invalid-email',
        password: validUserData.password,
      };
      const res = await createRequest(data);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        message: [
          {
            property: 'email',
            value: data.email,
            constraints: {
              isEmail: 'email must be an email',
            },
          },
        ],
        error: 'app_validation_error',
        statusCode: 400,
      });
    });
    it('should return validation error for password', async () => {
      const data = {
        email: 'users-e2e-2@email-test.com',
        password: 'invalid-password',
      };
      const res = await createRequest(data);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        message: [
          {
            property: 'password',
            value: data.password,
            constraints: {
              isStrongPassword: 'password is not strong enough',
            },
          },
        ],
        error: 'app_validation_error',
        statusCode: 400,
      });
    });
    it('should return "already_exists"', async () => {
      const res = await createRequest({
        email: validUserData.email,
        password: validUserData.password,
      });
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: 'Already exists',
        error: 'already_exists',
      });
    });
    it('should return "already_exists" even with email using different case', async () => {
      const res = await createRequest({
        email: validUserData.email.toUpperCase(),
        password: validUserData.password,
      });
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        statusCode: 400,
        message: 'Already exists',
        error: 'already_exists',
      });
    });
    it('should return "created"', async () => {
      const data = {
        email: 'users-e2e-2@email-test.com',
        password: validUserData.password,
      };
      const res = await createRequest(data);
      expect(res.status).toEqual(201);
      expect(res.body).toEqual({
        id: expect.any(String),
        email: data.email,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });
});
