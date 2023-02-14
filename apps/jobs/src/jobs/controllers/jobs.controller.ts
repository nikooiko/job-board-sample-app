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
import { ListJobDto } from '@app/extra/svc-jobs/dto/list-job.dto';
import { JobDto } from '@app/extra/svc-jobs/dto/job.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JobsService } from '../services/jobs.service';
import { PatchJobDto } from '@app/extra/svc-jobs/dto/patch-job.dto';
import { ApiAppBadRequestResponse } from '@app/core/error-handling/decorators/api-app-bad-request-response.decorator';
import { FindAllJobsQueryDto } from '@app/extra/svc-jobs/dto/find-all-jobs-query.dto';
import { ApiAppNotFoundResponse } from '@app/core/error-handling/decorators/api-app-not-found-response.decorator';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

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
  @ApiOkResponse({ type: ListJobDto })
  @ApiAppBadRequestResponse()
  findAll(@Query() query: FindAllJobsQueryDto): Promise<ListJobDto> {
    return this.jobsService.findAll({
      take: query.limit,
      skip: query.page * query.limit,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Returns the corresponding job',
  })
  @ApiOkResponse({ type: JobDto })
  @ApiAppBadRequestResponse()
  @ApiAppNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number): Promise<JobDto> {
    return this.jobsService.findOne({ id });
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Updates the corresponding job',
  })
  @ApiOkResponse({ type: JobDto })
  @ApiAppBadRequestResponse()
  @ApiAppNotFoundResponse()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: PatchJobDto,
  ): Promise<JobDto> {
    return this.jobsService.update({
      where: { id },
      data,
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletes the corresponding job',
  })
  @ApiOkResponse({ type: JobDto })
  @ApiAppBadRequestResponse()
  @ApiAppNotFoundResponse()
  remove(@Param('id', ParseIntPipe) id: number): Promise<JobDto> {
    return this.jobsService.remove({ id });
  }
}
