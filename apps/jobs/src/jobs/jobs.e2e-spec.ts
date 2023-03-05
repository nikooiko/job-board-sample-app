import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from '@app/core/core.module';
import { INestApplication } from '@nestjs/common';
import { EmploymentType, Job, Prisma } from '@app/jobs/prisma-client';
import request from 'supertest';
import crypto from 'node:crypto';
import { ownerIdGuardTestCases } from '@app/testing/owner-id/owner-id-guard-test-cases';
import { requestWithOwnerIdHeader } from '@app/testing/owner-id/request-with-owner-id-header';
import { JobsPrismaService } from '../jobs-prisma/services/jobs-prisma.service';
import { JobsModule } from './jobs.module';

function jobGenerator(data: Partial<Prisma.JobCreateInput> = {}, idx?: number) {
  const random = idx ?? Math.floor(Math.random() * 10000) + 1;
  return {
    title: `Title:${random}`,
    description: `Description:${random}`,
    salary: random,
    ownerId: crypto.randomUUID(),
    employmentType: EmploymentType.FULL_TIME,
    ...data,
  };
}

function jobResponseMap(job: Job) {
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    salary: job.salary,
    employmentType: job.employmentType,
    ownerId: job.ownerId,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    searchIndex: job.searchIndex,
    searchableSince: job.searchableSince?.toISOString() ?? null,
  };
}

describe('Jobs (e2e)', () => {
  let app: INestApplication;
  let prisma: JobsPrismaService;
  const owner1Id = '00000000-0000-0000-0000-0000000f0001';
  const owner1JobData = Array.from({ length: 5 }, (v: any, i: number) =>
    jobGenerator({ ownerId: owner1Id }, i),
  );
  const owner2Id = '00000000-0000-0000-0000-0000000f0002';
  const owner2JobsData = Array.from({ length: 5 }, (v: any, i: number) =>
    jobGenerator({ ownerId: owner2Id }, i),
  );
  let owner1DBJobs: Job[];
  let owner2DBJobs: Job[];
  let owner1HTTPJobs: any[];
  let owner2HTTPJobs: any[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, JobsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<JobsPrismaService>(JobsPrismaService);
  });
  beforeEach(async () => {
    await prisma.job.deleteMany(); // make sure data are clean
    await prisma.job.createMany({
      data: [...owner1JobData, ...owner2JobsData],
    });
    owner1DBJobs = await prisma.job.findMany({
      where: { ownerId: owner1Id },
    });
    owner1HTTPJobs = owner1DBJobs.map(jobResponseMap);
    owner2DBJobs = await prisma.job.findMany({
      where: { ownerId: owner2Id },
    });
    owner2HTTPJobs = owner2DBJobs.map(jobResponseMap);
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
    ownerIdGuardTestCases(() => createRequest(owner1DBJobs[0]));
    it('should return validation error for title', async () => {
      const data = jobGenerator({
        ownerId: '00000000-000f-0000-0000-000000000001',
        title: '',
      });
      const res = await createRequest(data, data.ownerId);
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
      const data = jobGenerator({
        ownerId: '00000000-000f-0000-0000-000000000001',
        description: '',
      });
      const res = await createRequest(data, data.ownerId);
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
      const data = jobGenerator({
        ownerId: '00000000-000f-0000-0000-000000000001',
      });
      const res = await createRequest(data, data.ownerId);
      expect(res.status).toEqual(201);
      expect(res.body).toEqual({
        ...data,
        searchIndex: null,
        searchableSince: null,
        ownerId: data.ownerId,
        id: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
  describe('GET /jobs', () => {
    const createRequest = (query: any, ownerId?: string) => {
      const agent = request.agent(app.getHttpServer());
      const req = agent.get('/jobs').query(query);
      if (ownerId) {
        requestWithOwnerIdHeader(req, ownerId);
      }
      return req;
    };
    ownerIdGuardTestCases(() => createRequest({}));
    it('should return validation error for limit', async () => {
      const limit = 'invalid';
      const res = await createRequest({ limit }, owner1DBJobs[0].ownerId);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        message: [
          {
            property: 'limit',
            value: null,
            constraints: {
              isInt: 'limit must be an integer number',
              max: 'limit must not be greater than 100',
              min: 'limit must not be less than 1',
            },
          },
        ],
        error: 'app_validation_error',
        statusCode: 400,
      });
    });
    it('should return validation error for page', async () => {
      const page = -1;
      const res = await createRequest({ page }, owner1DBJobs[0].ownerId);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        message: [
          {
            property: 'page',
            value: page,
            constraints: {
              min: 'page must not be less than 0',
            },
          },
        ],
        error: 'app_validation_error',
        statusCode: 400,
      });
    });
    it('should return empty results', async () => {
      const res = await createRequest(
        {},
        '00000000-000f-0000-0000-0000000f0003',
      );
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        items: [],
        limit: 10,
        count: 0,
        pages: 0,
      });
    });
    it('should return only owner1 jobs', async () => {
      const res = await createRequest({}, owner1Id);
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        items: owner1HTTPJobs,
        limit: 10,
        count: 5,
        pages: 1,
      });
    });
    it('should return only owner2 jobs 1st page', async () => {
      const res = await createRequest(
        {
          limit: 3,
          page: 0,
        },
        owner2Id,
      );
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        items: owner2HTTPJobs.slice(0, 3),
        limit: 3,
        count: 5,
        pages: 2,
      });
    });
    it('should return only owner2 jobs 2nd page', async () => {
      const res = await createRequest(
        {
          limit: 3,
          page: 1,
        },
        owner2Id,
      );
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        items: owner2HTTPJobs.slice(3),
        limit: 3,
        count: 5,
        pages: 2,
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
      const res = await createRequest(id, owner1DBJobs[0].ownerId);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        message: "Param 'id' must be an integer",
        error: 'bad_request',
        statusCode: 400,
      });
    });
    it('should return 404 when job not found', async () => {
      const res = await createRequest(999999, owner1DBJobs[0].ownerId);
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        message: 'Not Found',
        error: 'not_found',
        statusCode: 404,
      });
    });
    it('should return 404 when job is owned by another user', async () => {
      const res = await createRequest(owner1DBJobs[0].id, owner2Id);
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        message: 'Not Found',
        error: 'not_found',
        statusCode: 404,
      });
    });
    it('should return 200', async () => {
      const res = await createRequest(
        owner1DBJobs[0].id,
        owner1DBJobs[0].ownerId,
      );
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        id: owner1DBJobs[0].id,
        ownerId: owner1DBJobs[0].ownerId,
        title: owner1DBJobs[0].title,
        description: owner1DBJobs[0].description,
        salary: owner1DBJobs[0].salary,
        employmentType: owner1DBJobs[0].employmentType,
        searchIndex: null,
        searchableSince: null,
        createdAt: owner1DBJobs[0].createdAt.toISOString(),
        updatedAt: owner1DBJobs[0].updatedAt.toISOString(),
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
