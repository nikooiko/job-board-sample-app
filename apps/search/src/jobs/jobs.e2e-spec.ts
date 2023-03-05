import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from '@app/core/core.module';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { JobDto } from '@app/extra/svc-jobs/dto/job.dto';
import { JobsModule } from './jobs.module';
import { ElasticsearchService } from '@app/extra/elasticsearch/services/elasticsearch.service';
import { jobsIndex } from './indices/jobs.index';
import { JobsService } from './services/jobs.service';

describe('Jobs (e2e)', () => {
  let app: INestApplication;
  let jobsService: JobsService;
  let esService: ElasticsearchService;
  const jobData: JobDto[] = [
    {
      id: 0,
      title: 'Software Developer',
      description:
        'Responsible for designing, developing, and testing software applications.',
      salary: 85000,
      employmentType: 'FULL_TIME',
      ownerId: '00000000-0000-0000-0000-000000000001',
      searchIndex: null,
      searchableSince: null,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
    {
      id: 1,
      title: 'Sales Manager',
      description:
        'Lead and manage a sales team, responsible for meeting sales targets and managing customer relationships.',
      salary: 100000,
      employmentType: 'FULL_TIME',
      ownerId: '00000000-0000-0000-0000-000000000001',
      searchIndex: null,
      searchableSince: null,
      createdAt: new Date(1),
      updatedAt: new Date(1),
    },
    {
      id: 2,
      title: 'Customer Support Specialist',
      description:
        'Provide technical and customer support to clients, troubleshoot and resolve customer issues.',
      salary: 55000,
      employmentType: 'FULL_TIME',
      ownerId: '00000000-0000-0000-0000-000000000001',
      searchIndex: null,
      searchableSince: null,
      createdAt: new Date(2),
      updatedAt: new Date(2),
    },
    {
      id: 3,
      title: 'Human Resources Assistant',
      description:
        'Provide administrative support to the HR department, assist with recruitment, onboarding, and benefits administration.',
      salary: 60000,
      employmentType: 'FULL_TIME',
      ownerId: '00000000-0000-0000-0000-000000000001',
      searchIndex: null,
      searchableSince: null,
      createdAt: new Date(3),
      updatedAt: new Date(3),
    },
    {
      id: 4,
      title: 'Product Manager',
      description:
        'Define and prioritize product requirements, work with development teams to bring new products to market.',
      salary: 90000,
      employmentType: 'FULL_TIME',
      ownerId: '00000000-0000-0000-0000-000000000002',
      searchIndex: null,
      searchableSince: null,
      createdAt: new Date(4),
      updatedAt: new Date(4),
    },
    {
      id: 5,
      title: 'Marketing Coordinator',
      description:
        'Assist with the planning and execution of marketing campaigns, manage social media accounts, and produce marketing materials.',
      salary: 65000,
      employmentType: 'FULL_TIME',
      ownerId: '00000000-0000-0000-0000-000000000002',
      searchIndex: null,
      searchableSince: null,
      createdAt: new Date(5),
      updatedAt: new Date(5),
    },
    {
      id: 6,
      title: 'Financial Analyst',
      description:
        'Perform financial analysis and modeling, support decision making for the organization.',
      salary: 75000,
      employmentType: 'FULL_TIME',
      ownerId: '00000000-0000-0000-0000-000000000002',
      searchIndex: null,
      searchableSince: null,
      createdAt: new Date(6),
      updatedAt: new Date(6),
    },
  ];
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, JobsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jobsService = moduleFixture.get<JobsService>(JobsService);
    esService = moduleFixture.get<ElasticsearchService>(ElasticsearchService);
  });
  beforeEach(async () => {
    if (await esService.indices.exists({ index: jobsIndex.index })) {
      await esService.indices.delete({
        index: jobsIndex.index,
      });
      await esService.indices.create(jobsIndex);
    }
    await Promise.all(jobData.map((job) => jobsService.upsert(job)));
  });

  describe('GET /jobs/index', () => {
    it('should return the index name', async () => {
      const res = await request(app.getHttpServer()).get('/jobs/index');
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({ index: jobsIndex.index });
    });
  });
  describe('POST /jobs', () => {
    const createRequest = (data: any) => {
      const agent = request.agent(app.getHttpServer());
      return agent.post('/jobs').send(data);
    };
    it('should return 400 with invalid data', async () => {
      const res = await createRequest({});
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        message: expect.any(Array),
        error: 'app_validation_error',
        statusCode: 400,
      });
    });
    it('should return "created"', async () => {
      const data = {
        id: 9999,
        title: 'Software Developer',
        description:
          'Responsible for designing, developing, and testing software applications.',
        salary: 85000,
        employmentType: 'FULL_TIME',
        ownerId: '00000000-0000-0000-0000-000000000001',
        searchIndex: null,
        searchableSince: null,
        createdAt: new Date(0),
        updatedAt: new Date(0),
      };
      const res = await createRequest(data);
      expect(res.status).toEqual(201);
      expect(res.body).toEqual({
        searchIndex: jobsIndex.index,
        searchableSince: expect.any(String),
      });
    });
  });

  afterAll(async () => {
    await esService.indices.delete({
      index: jobsIndex.index,
    });
    return app.close();
  });
});
