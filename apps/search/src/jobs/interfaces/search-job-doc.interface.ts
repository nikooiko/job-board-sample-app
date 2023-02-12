import { EmploymentType } from '@app/jobs/prisma-client';

export interface SearchJobDoc {
  id: number;
  title: string;
  description: string;
  salary: number;
  employment_type: EmploymentType;
  searchIndex: string | null;
  searchableSince: Date | null;
}
