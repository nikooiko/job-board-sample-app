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
  ValidateIf,
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
  @ApiProperty({ nullable: true, type: String })
  @IsString()
  @ValidateIf((object, value) => value !== null)
  searchIndex: string | null = null;
  @ApiProperty({ nullable: true, type: Date })
  @IsDate()
  @ValidateIf((object, value) => value !== null)
  searchableSince: Date | null = null;
  @ApiProperty()
  @IsDate()
  createdAt: Date;
  @ApiProperty()
  @IsDate()
  updatedAt: Date;
}
