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
import { CreateJobDto } from '@app/extra/jobs/dto/create-job.dto';
import { JobsService } from '../services/jobs.service';
import { JobDto } from '@app/extra/jobs/dto/job.dto';
import { PatchJobDto } from '@app/extra/jobs/dto/patch-job.dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ListJobDto } from '@app/extra/jobs/dto/list-job.dto';
import { ApiAppBadRequestResponse } from '@app/core/error-handling/decorators/api-app-bad-request-response.decorator';
import { FindAllJobsQueryDto } from '@app/extra/jobs/dto/find-all-jobs-query.dto';

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
  @ApiNotFoundResponse()
  findAll(@Query() query: FindAllJobsQueryDto): Promise<ListJobDto> {
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
