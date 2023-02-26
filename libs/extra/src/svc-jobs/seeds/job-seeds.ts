import { Prisma, PrismaClient } from '@app/jobs/prisma-client';

export const jobSeeds = async (prisma: PrismaClient) => {
  const jobs: Prisma.JobCreateManyInput[] = [
    {
      title: 'Software Developer',
      description:
        'Responsible for designing, developing, and testing software applications.',
      salary: 85000,
      employmentType: 'FULL_TIME',
      ownerId: '00000000-0000-0000-0000-000000000001',
    },
    {
      title: 'Sales Manager',
      description:
        'Lead and manage a sales team, responsible for meeting sales targets and managing customer relationships.',
      salary: 100000,
      employmentType: 'FULL_TIME',
      ownerId: '00000000-0000-0000-0000-000000000001',
    },
    {
      title: 'Customer Support Specialist',
      description:
        'Provide technical and customer support to clients, troubleshoot and resolve customer issues.',
      salary: 55000,
      employmentType: 'FULL_TIME',
      ownerId: '00000000-0000-0000-0000-000000000001',
    },
    {
      title: 'Human Resources Assistant',
      description:
        'Provide administrative support to the HR department, assist with recruitment, onboarding, and benefits administration.',
      salary: 60000,
      employmentType: 'FULL_TIME',
      ownerId: '00000000-0000-0000-0000-000000000001',
    },
    {
      title: 'Product Manager',
      description:
        'Define and prioritize product requirements, work with development teams to bring new products to market.',
      salary: 90000,
      employmentType: 'FULL_TIME',
      ownerId: '00000000-0000-0000-0000-000000000002',
    },
    {
      title: 'Marketing Coordinator',
      description:
        'Assist with the planning and execution of marketing campaigns, manage social media accounts, and produce marketing materials.',
      salary: 65000,
      employmentType: 'FULL_TIME',
      ownerId: '00000000-0000-0000-0000-000000000002',
    },
    {
      title: 'Financial Analyst',
      description:
        'Perform financial analysis and modeling, support decision making for the organization.',
      salary: 75000,
      employmentType: 'FULL_TIME',
      ownerId: '00000000-0000-0000-0000-000000000002',
    },
    {
      title: 'Graphic Designer',
      description:
        'Create visual concepts, using computer software or by hand, to communicate ideas that inspire, inform, or captivate consumers.',
      salary: 65000,
      employmentType: 'FULL_TIME',
      ownerId: '00000000-0000-0000-0000-000000000003',
    },
    {
      title: 'IT Support Technician',
      description:
        'Provide technical support to end-users, install and maintain computer systems and networks.',
      salary: 65000,
      employmentType: 'PART_TIME',
      ownerId: '00000000-0000-0000-0000-000000000003',
    },
    {
      title: 'Content Writer',
      description:
        'Write clear and compelling content for websites, marketing materials, and other forms of media.',
      salary: 65000,
      employmentType: 'PART_TIME',
      ownerId: '00000000-0000-0000-0000-000000000003',
    },
    {
      title: 'Data Scientist',
      description:
        'Collect and analyze large datasets, build statistical models, and create data-driven insights.',
      salary: 85000,
      employmentType: 'FULL_TIME',
      ownerId: '00000000-0000-0000-0000-000000000003',
    },
    {
      title: 'Project Manager',
      description:
        'Plan and oversee projects, ensure that goals are met on time and within budget.',
      salary: 85000,
      employmentType: 'FULL_TIME',
      ownerId: '00000000-0000-0000-0000-000000000003',
    },
    {
      title: 'Web Developer',
      description:
        'Design, build, and maintain websites, work with a variety of programming languages.',
      salary: 75000,
      employmentType: 'FULL_TIME',
      ownerId: '00000000-0000-0000-0000-000000000003',
    },
    {
      title: 'Retail Sales Associate',
      description: 'Provide customer service, assist with sales',
      salary: 70000,
      employmentType: 'FULL_TIME',
      ownerId: '00000000-0000-0000-0000-000000000003',
    },
  ];
  return prisma.job.createMany({
    data: jobs,
  });
};
