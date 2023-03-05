import { Job } from '@app/jobs/prisma-client';

export function jobResponseMap(job: Job) {
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
