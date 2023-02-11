import { LimitParam } from '@app/core/pagination/decorators/limit-param.decorator';
import { PageParam } from '@app/core/pagination/decorators/page-param.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';
import { EmploymentType } from '@app/jobs/prisma-client';
import { IsGreaterThan } from '@app/core/api/decorators/is-greater-than.decorator';

export class SearchJobsQueryDto {
  @LimitParam({ default: 10 })
  readonly limit: number = 10;

  @PageParam({ default: 0 })
  readonly page: number = 0;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  searchText?: string;

  @ApiPropertyOptional({ enum: EmploymentType })
  @IsEnum(EmploymentType)
  @IsOptional()
  employmentType?: EmploymentType;

  @ApiPropertyOptional()
  @IsPositive()
  @IsOptional()
  salaryFrom?: number;

  @ApiPropertyOptional()
  @IsPositive()
  @IsGreaterThan('salaryFrom')
  @IsOptional()
  salaryTo?: number;
}
