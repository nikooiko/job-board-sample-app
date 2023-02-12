import { JobDto } from '@app/extra/svc-jobs/dto/job.dto';
import { PagedListDto } from '@app/core/pagination/dto/paged-list.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ListJobDto extends PagedListDto {
  @ApiProperty({ type: JobDto, isArray: true })
  items: JobDto[];
}
