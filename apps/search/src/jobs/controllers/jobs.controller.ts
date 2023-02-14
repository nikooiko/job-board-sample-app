import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { JobsListDto } from '@app/extra/svc-jobs/dto/jobs-list.dto';
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

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('index')
  @ApiOperation({
    summary: 'Returns the name of the active job index',
  })
  @ApiOkResponse()
  async getIndexName(): Promise<string> {
    return jobsIndex.index;
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
  @ApiOkResponse({ type: JobsListDto })
  @ApiAppBadRequestResponse()
  search(@Query() query: SearchJobsQueryDto): Promise<JobsListDto> {
    return this.jobsService.search(query);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletes the corresponding job',
  })
  @ApiNoContentResponse()
  @ApiAppBadRequestResponse()
  @ApiNotFoundResponse()
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.jobsService.remove(id);
  }
}
