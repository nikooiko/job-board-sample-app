import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateJobDto } from '@app/extra/jobs/dto/create-job.dto';
import { ListJobDto } from '@app/extra/jobs/dto/list-job.dto';
import { JobDto } from '@app/extra/jobs/dto/job.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { JobsService } from '../services/jobs.service';
import { PatchJobDto } from '@app/extra/jobs/dto/patch-job.dto';
import { ApiAppBadRequestResponse } from '@app/core/error-handling/decorators/api-app-bad-request-response.decorator';
import { FindAllJobsQueryDto } from '@app/extra/jobs/dto/find-all-jobs-query.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiCreatedResponse({ type: JobDto })
  @ApiAppBadRequestResponse()
  create(@Body() data: CreateJobDto): Promise<JobDto> {
    return this.jobsService.create(data);
  }

  @Get()
  @ApiOkResponse({ type: ListJobDto })
  @ApiAppBadRequestResponse()
  findAll(@Query() query: FindAllJobsQueryDto): Promise<ListJobDto> {
    return this.jobsService.findAll({
      take: query.limit,
      skip: query.page * query.limit,
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: JobDto })
  @ApiAppBadRequestResponse()
  findOne(@Param('id') id: number): Promise<JobDto> {
    return this.jobsService.findOne({ id });
  }

  @Patch(':id')
  @ApiOkResponse({ type: JobDto })
  @ApiAppBadRequestResponse()
  update(@Param('id') id: number, @Body() data: PatchJobDto): Promise<JobDto> {
    return this.jobsService.update({
      where: { id },
      data,
    });
  }

  @Delete(':id')
  @ApiOkResponse({ type: JobDto })
  @ApiAppBadRequestResponse()
  remove(@Param('id') id: number): Promise<JobDto> {
    return this.jobsService.remove({ id });
  }
}
