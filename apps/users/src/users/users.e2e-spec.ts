import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from '@app/core/core.module';
import { INestApplication } from '@nestjs/common';
import { User } from '@app/users/prisma-client';
import request from 'supertest';
import { UsersPrismaService } from '../users-prisma/services/users-prisma.service';
import { UsersModule } from './users.module';
import { UsersService } from './services/users.service';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
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
    usersService = moduleFixture.get<UsersService>(UsersService);
  });
  beforeEach(async () => {
    createdUser = await prisma.user.create({
      data: {
        ...validUserData,
        password: await usersService.hashPassword(validUserData.password),
      },
    });
  });

  describe('POST /users', () => {
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
  describe('POST /users/validate-credentials', () => {
    const createRequest = (data: any) => {
      const agent = request.agent(app.getHttpServer());
      return agent.post('/users/validate-credentials').send(data);
    };
    it('should return validation error with email', async () => {
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
    it('should return 401 when user not found', async () => {
      const data = {
        email: 'users-e2e-2@email-test.com',
        password: validUserData.password,
      };
      const res = await createRequest(data);
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        message: 'Invalid credentials',
        error: 'unauthorized',
        statusCode: 401,
      });
    });
    it('should return 401 when invalid password', async () => {
      const data = {
        email: validUserData.email,
        password: validUserData.password + '-mismatch',
      };
      const res = await createRequest(data);
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        message: 'Invalid credentials',
        error: 'unauthorized',
        statusCode: 401,
      });
    });
    it('should return 200 with valid credentials', async () => {
      const data = {
        email: validUserData.email,
        password: validUserData.password,
      };
      const res = await createRequest(data);
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        id: createdUser.id,
        email: createdUser.email,
        createdAt: createdUser.createdAt.toISOString(),
        updatedAt: createdUser.updatedAt.toISOString(),
      });
    });
  });
  describe('GET /users/:id', () => {
    const createRequest = (id: any) => {
      const agent = request.agent(app.getHttpServer());
      return agent.get(`/users/${id}`);
    };
    it('should return validation error with invalid id', async () => {
      const id = 'invalid-id';
      const res = await createRequest(id);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        message: "Param 'id' must be a UUID",
        error: 'bad_request',
        statusCode: 400,
      });
    });
    it('should return 404 when user not found', async () => {
      const res = await createRequest('00000000-0000-0000-0000-00000000FFFF');
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        message: 'Not Found',
        error: 'not_found',
        statusCode: 404,
      });
    });
    it('should return 200 with valid credentials', async () => {
      const res = await createRequest(createdUser.id);
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        id: createdUser.id,
        email: createdUser.email,
        createdAt: createdUser.createdAt.toISOString(),
        updatedAt: createdUser.updatedAt.toISOString(),
      });
    });
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });
  afterAll(() => {
    return app.close();
  });
});
