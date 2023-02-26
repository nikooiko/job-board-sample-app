import { ApiProperty, OmitType } from '@nestjs/swagger';
import { JobDto } from '@app/extra/svc-jobs/dto/job.dto';
import { EmploymentType } from '@app/jobs/prisma-client';
import { IsEnum, IsPositive, IsString } from 'class-validator';

export class CreateJobDto extends OmitType(JobDto, [
  'id',
  'ownerId',
  'searchIndex',
  'searchableSince',
] as const) {
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty({ default: 100 })
  @IsPositive()
  salary: number;
  @ApiProperty({ enum: EmploymentType })
  @IsEnum(EmploymentType)
  employmentType: EmploymentType;
}
