import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from '@app/core/core.module';
import { INestApplication } from '@nestjs/common';
import { Job, Prisma } from '@app/jobs/prisma-client';
import request from 'supertest';
import { JobsPrismaService } from '../jobs-prisma/services/jobs-prisma.service';
import { JobsModule } from './jobs.module';
import { ownerIdGuardTestCases } from '@app/testing/owner-id/owner-id-guard-test-cases';
import { requestWithOwnerIdHeader } from '@app/testing/owner-id/request-with-owner-id-header';

describe('Jobs (e2e)', () => {
  let app: INestApplication;
  let prisma: JobsPrismaService;
  const validJobData: Prisma.JobCreateInput = {
    title: 'Developer',
    description: 'Development',
    salary: 85000,
    employmentType: 'FULL_TIME',
    ownerId: '00000000-0000-0000-0000-00000000ffff',
  };
  let createdJob: Job;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, JobsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<JobsPrismaService>(JobsPrismaService);
  });
  beforeEach(async () => {
    createdJob = await prisma.job.create({
      data: validJobData,
    });
  });

  describe('POST /jobs', () => {
    const createRequest = (data: any, ownerId?: string) => {
      const agent = request.agent(app.getHttpServer());
      const req = agent.post('/jobs').send(data);
      if (ownerId) {
        requestWithOwnerIdHeader(req, ownerId);
      }
      return req;
    };
    ownerIdGuardTestCases(() => createRequest(validJobData));
    it('should return validation error for title', async () => {
      const data = {
        ...validJobData,
        title: '',
      };
      const res = await createRequest(data, validJobData.ownerId);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        message: [
          {
            property: 'title',
            value: data.title,
            constraints: {
              isNotEmpty: 'title should not be empty',
            },
          },
        ],
        error: 'app_validation_error',
        statusCode: 400,
      });
    });
    it('should return validation error for description', async () => {
      const data = {
        ...validJobData,
        description: '',
      };
      const res = await createRequest(data, validJobData.ownerId);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        message: [
          {
            property: 'description',
            value: data.description,
            constraints: {
              isNotEmpty: 'description should not be empty',
            },
          },
        ],
        error: 'app_validation_error',
        statusCode: 400,
      });
    });
    it('should return "created"', async () => {
      const res = await createRequest(validJobData, validJobData.ownerId);
      expect(res.status).toEqual(201);
      expect(res.body).toEqual({
        ...validJobData,
        searchIndex: null,
        searchableSince: null,
        ownerId: validJobData.ownerId,
        id: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
  describe('GET /jobs/:id', () => {
    const createRequest = (id: any, ownerId?: string) => {
      const agent = request.agent(app.getHttpServer());
      const req = agent.get(`/jobs/${id}`);
      if (ownerId) {
        requestWithOwnerIdHeader(req, ownerId);
      }
      return req;
    };
    ownerIdGuardTestCases(() => createRequest(1));
    it('should return 400 with invalid id', async () => {
      const id = 'abc';
      const res = await createRequest(id, validJobData.ownerId);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        message: "Param 'id' must be an integer",
        error: 'bad_request',
        statusCode: 400,
      });
    });
    it('should return 404 when job not found', async () => {
      const res = await createRequest(999999, validJobData.ownerId);
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        message: 'Not Found',
        error: 'not_found',
        statusCode: 404,
      });
    });
    it('should return 404 when job is owned by another user', async () => {
      const res = await createRequest(
        createdJob.id,
        '00000000-0000-0000-0000-00000000fff0',
      );
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        message: 'Not Found',
        error: 'not_found',
        statusCode: 404,
      });
    });
    it('should return 200', async () => {
      const res = await createRequest(createdJob.id, validJobData.ownerId);
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        id: createdJob.id,
        ownerId: createdJob.ownerId,
        title: createdJob.title,
        description: createdJob.description,
        salary: createdJob.salary,
        employmentType: createdJob.employmentType,
        searchIndex: null,
        searchableSince: null,
        createdAt: createdJob.createdAt.toISOString(),
        updatedAt: createdJob.updatedAt.toISOString(),
      });
    });
  });

  afterEach(async () => {
    await prisma.job.deleteMany();
  });
  afterAll(() => {
    return app.close();
  });
});
