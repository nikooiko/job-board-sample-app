import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { JobDto } from '../../svc-jobs/dto/job.dto';

export class SearchJobDto extends JobDto {
  @ApiProperty()
  @IsNumber()
  score: number;
}
