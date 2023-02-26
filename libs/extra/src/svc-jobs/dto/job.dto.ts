import { EmploymentType, Job } from '@app/jobs/prisma-client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class JobDto implements Omit<Job, 'deletedAt'> {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  id: number;
  @ApiProperty()
  @IsUUID()
  ownerId: string;
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
  @ApiProperty({ nullable: true })
  @IsString()
  searchIndex: string | null = null;
  @ApiProperty({ nullable: true })
  @IsDate()
  searchableSince: Date | null = null;
  @ApiProperty()
  @IsDate()
  createdAt: Date;
  @ApiProperty()
  @IsDate()
  updatedAt: Date;
}
