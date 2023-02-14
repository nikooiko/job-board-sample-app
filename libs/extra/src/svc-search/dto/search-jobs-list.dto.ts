import { PagedListDto } from '@app/core/pagination/dto/paged-list.dto';
import { ApiProperty } from '@nestjs/swagger';
import { SearchJobDto } from './search-job.dto';

export class SearchJobsListDto extends PagedListDto {
  @ApiProperty({ type: SearchJobDto, isArray: true })
  items: SearchJobDto[];
}
