import {
  Body,
  Controller,
  Delete,
  Get,
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
import { AuthGuard } from '../../auth/decorators/auth-guard.decorator';
import { AccessTokenDataDto } from '../../auth/dto/access-token-data.dto';
import { AuthUser } from '../../auth/decorators/auth-user.decorator';
import { IntParam } from '@app/core/api/decorators/int-param.decorator';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(
    private readonly svcJobsService: SvcJobsService,
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
  @AuthGuard()
  create(
    @AuthUser() user: AccessTokenDataDto,
    @Body() data: CreateJobDto,
  ): Promise<JobDto> {
    return this.svcJobsService.create(user.id, data);
  }

  @Get()
  @ApiOperation({
    summary: 'Returns the list of jobs',
  })
  @ApiOkResponse({ type: JobsListDto })
  @ApiAppBadRequestResponse()
  @ApiNotFoundResponse()
  @AuthGuard()
  findAll(
    @AuthUser() user: AccessTokenDataDto,
    @Query() query: FindAllJobsQueryDto,
  ): Promise<JobsListDto> {
    return this.svcJobsService.findAll(user.id, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Returns the corresponding job',
  })
  @ApiOkResponse({ type: JobDto })
  @ApiAppBadRequestResponse()
  @ApiNotFoundResponse()
  @AuthGuard()
  findOne(
    @AuthUser() user: AccessTokenDataDto,
    @IntParam('id') id: number,
  ): Promise<JobDto> {
    return this.svcJobsService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Updates the corresponding job',
  })
  @ApiOkResponse({ type: JobDto })
  @ApiAppBadRequestResponse()
  @ApiNotFoundResponse()
  @AuthGuard()
  update(
    @AuthUser() user: AccessTokenDataDto,
    @IntParam('id') id: number,
    @Body() data: PatchJobDto,
  ): Promise<JobDto> {
    return this.svcJobsService.update(user.id, id, data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletes the corresponding job',
  })
  @ApiOkResponse({ type: JobDto })
  @ApiAppBadRequestResponse()
  @ApiNotFoundResponse()
  @AuthGuard()
  remove(
    @AuthUser() user: AccessTokenDataDto,
    @IntParam('id') id: number,
  ): Promise<JobDto> {
    return this.svcJobsService.remove(user.id, id);
  }
}
