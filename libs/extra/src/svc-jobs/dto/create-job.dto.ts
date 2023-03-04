import { ApiProperty } from '@nestjs/swagger';
import { JobDto } from '@app/extra/svc-jobs/dto/job.dto';
import { EmploymentType } from '@app/jobs/prisma-client';
import { IsEnum, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateJobDto
  implements
    Omit<
      JobDto,
      | 'id'
      | 'ownerId'
      | 'searchIndex'
      | 'searchableSince'
      | 'createdAt'
      | 'updatedAt'
    >
{
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
  @ApiProperty({ default: 100 })
  @IsPositive()
  salary: number;
  @ApiProperty({ enum: EmploymentType })
  @IsEnum(EmploymentType)
  employmentType: EmploymentType;
}
