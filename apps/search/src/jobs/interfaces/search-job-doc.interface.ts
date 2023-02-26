import { EmploymentType } from '@app/jobs/prisma-client';

export interface SearchJobDoc {
  id: number;
  owner_id: string;
  title: string;
  description: string;
  salary: number;
  employment_type: EmploymentType;
  searchable_since: Date | null;
}
