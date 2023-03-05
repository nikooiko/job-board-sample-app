import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { JobDto } from '@app/extra/svc-jobs/dto/job.dto';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JobsService } from '../services/jobs.service';
import { ApiAppBadRequestResponse } from '@app/core/error-handling/decorators/api-app-bad-request-response.decorator';
import { SearchJobsQueryDto } from '@app/extra/svc-search/dto/search-jobs-query.dto';
import { jobsIndex } from '../indices/jobs.index';
import { UpsertJobResponseDto } from '@app/extra/svc-search/dto/upsert-job-response.dto';
import { SearchJobsListDto } from '@app/extra/svc-search/dto/search-jobs-list.dto';
import { IndexResponseDto } from '@app/extra/svc-search/dto/index-response.dto';
import { IntParam } from '@app/core/api/decorators/int-param.decorator';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('index')
  @ApiOperation({
    summary: 'Returns the name of the active job index',
  })
  @ApiOkResponse({
    type: IndexResponseDto,
  })
  async getIndexName(): Promise<IndexResponseDto> {
    return {
      index: jobsIndex.index,
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Updates or creates a job document at jobs search index',
  })
  @ApiCreatedResponse({ type: UpsertJobResponseDto })
  @ApiAppBadRequestResponse()
  upsert(@Body() data: JobDto): Promise<UpsertJobResponseDto> {
    return this.jobsService.upsert(data);
  }

  @Get()
  @ApiOperation({
    summary: 'Searches for matching jobs',
  })
  @ApiOkResponse({ type: SearchJobsListDto })
  @ApiAppBadRequestResponse()
  search(@Query() query: SearchJobsQueryDto): Promise<SearchJobsListDto> {
    return this.jobsService.search(query);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Deletes the corresponding job',
  })
  @ApiNoContentResponse()
  @ApiAppBadRequestResponse()
  @ApiNotFoundResponse()
  remove(@IntParam('id') id: number): Promise<void> {
    return this.jobsService.remove(id);
  }
}
