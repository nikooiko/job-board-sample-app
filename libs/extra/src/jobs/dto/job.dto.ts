import { EmploymentType, Job } from '@app/jobs/prisma-client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class JobDto implements Job {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  id: number;
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
