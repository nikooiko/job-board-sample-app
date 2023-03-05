import crypto from 'node:crypto';
import { EmploymentType, Prisma } from '@app/jobs/prisma-client';

export function jobGenerator(
  data: Partial<Prisma.JobCreateInput> = {},
  idx?: number,
) {
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
