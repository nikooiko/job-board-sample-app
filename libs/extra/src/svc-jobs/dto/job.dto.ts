import { EmploymentType, Job } from '@app/jobs/prisma-client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

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
  @ApiProperty({ nullable: true, type: String })
  @IsString()
  @IsOptional()
  searchIndex: string | null = null;
  @ApiProperty({ nullable: true, type: String })
  @IsString()
  @IsOptional()
  searchableSince: Date | null = null;
}
