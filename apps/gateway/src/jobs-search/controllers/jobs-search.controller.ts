import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListJobDto } from '@app/extra/svc-jobs/dto/list-job.dto';
import { ApiAppBadRequestResponse } from '@app/core/error-handling/decorators/api-app-bad-request-response.decorator';
import { SearchJobsQueryDto } from '@app/extra/svc-search/dto/search-jobs-query.dto';
import { SvcSearchService } from '@app/extra/svc-search/services/svc-search.service';

@ApiTags('Jobs')
@Controller('jobs/search')
export class JobsSearchController {
  constructor(private readonly svcSearchService: SvcSearchService) {}

  @Get()
  @ApiOperation({
    summary: 'Searches for matching jobs',
  })
  @ApiOkResponse({ type: ListJobDto })
  @ApiAppBadRequestResponse()
  search(@Query() query: SearchJobsQueryDto): Promise<ListJobDto> {
    return this.svcSearchService.searchJobs(query);
  }
}
