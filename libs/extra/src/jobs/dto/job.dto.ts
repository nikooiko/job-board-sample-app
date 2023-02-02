import { EmploymentType, Job } from '@app/jobs/prisma-client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsPositive, IsString } from 'class-validator';

export class JobDto implements Job {
  @ApiProperty()
  @IsPositive()
  id: number;
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsPositive()
  salary: number;
  @ApiProperty({ enum: EmploymentType })
  @IsEnum(EmploymentType)
  employmentType: EmploymentType;
}
