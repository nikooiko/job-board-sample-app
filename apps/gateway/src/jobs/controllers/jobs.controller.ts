import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateJobDto } from '@app/extra/svc-jobs/dto/create-job.dto';
import { SvcJobsService } from '@app/extra/svc-jobs/services/svc-jobs.service';
import { JobDto } from '@app/extra/svc-jobs/dto/job.dto';
import { PatchJobDto } from '@app/extra/svc-jobs/dto/patch-job.dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JobsListDto } from '@app/extra/svc-jobs/dto/jobs-list.dto';
import { ApiAppBadRequestResponse } from '@app/core/error-handling/decorators/api-app-bad-request-response.decorator';
import { FindAllJobsQueryDto } from '@app/extra/svc-jobs/dto/find-all-jobs-query.dto';
import { SearchJobsQueryDto } from '@app/extra/svc-search/dto/search-jobs-query.dto';
import { SvcSearchService } from '@app/extra/svc-search/services/svc-search.service';
import { SearchJobsListDto } from '@app/extra/svc-search/dto/search-jobs-list.dto';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: SvcJobsService,
    private readonly svcSearchService: SvcSearchService,
  ) {}

  @Get('search')
  @ApiOperation({
    summary: 'Searches for matching jobs',
  })
  @ApiOkResponse({ type: SearchJobsListDto })
  @ApiAppBadRequestResponse()
  search(@Query() query: SearchJobsQueryDto): Promise<SearchJobsListDto> {
    return this.svcSearchService.searchJobs(query);
  }

  @Post()
  @ApiOperation({
    summary: 'Creates a new job',
  })
  @ApiCreatedResponse({ type: JobDto })
  @ApiAppBadRequestResponse()
  create(@Body() data: CreateJobDto): Promise<JobDto> {
    return this.jobsService.create(data);
  }

  @Get()
  @ApiOperation({
    summary: 'Returns the list of jobs',
  })
  @ApiOkResponse({ type: JobsListDto })
  @ApiAppBadRequestResponse()
  @ApiNotFoundResponse()
  findAll(@Query() query: FindAllJobsQueryDto): Promise<JobsListDto> {
    return this.jobsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Returns the corresponding job',
  })
  @ApiOkResponse({ type: JobDto })
  @ApiAppBadRequestResponse()
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number): Promise<JobDto> {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Updates the corresponding job',
  })
  @ApiOkResponse({ type: JobDto })
  @ApiAppBadRequestResponse()
  @ApiNotFoundResponse()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: PatchJobDto,
  ): Promise<JobDto> {
    return this.jobsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletes the corresponding job',
  })
  @ApiOkResponse({ type: JobDto })
  @ApiAppBadRequestResponse()
  @ApiNotFoundResponse()
  remove(@Param('id', ParseIntPipe) id: number): Promise<JobDto> {
    return this.jobsService.remove(id);
  }
}
