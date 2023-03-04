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
import { JobsListDto } from '@app/extra/svc-jobs/dto/jobs-list.dto';
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
import { OwnerId } from '@app/extra/ownership/decorators/owner-id.decorator';
import { OwnerIdGuard } from '@app/extra/ownership/decorators/owner-id-guard.decorator';
import { IntParam } from '@app/core/api/decorators/int-param.decorator';

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
  @OwnerIdGuard()
  create(
    @OwnerId() ownerId: string,
    @Body() data: CreateJobDto,
  ): Promise<JobDto> {
    return this.jobsService.create({
      ...data,
      ownerId,
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Returns the list of jobs',
  })
  @ApiOkResponse({ type: JobsListDto })
  @ApiAppBadRequestResponse()
  @OwnerIdGuard()
  findAll(
    @OwnerId() ownerId: string,
    @Query() query: FindAllJobsQueryDto,
  ): Promise<JobsListDto> {
    return this.jobsService.findAll({
      take: query.limit,
      skip: query.page * query.limit,
      where: { ownerId },
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Returns the corresponding job',
  })
  @ApiOkResponse({ type: JobDto })
  @ApiAppBadRequestResponse()
  @ApiAppNotFoundResponse()
  @OwnerIdGuard()
  findOne(
    @OwnerId() ownerId: string,
    @IntParam('id') id: number,
  ): Promise<JobDto> {
    return this.jobsService.findOne({ ownerId, id });
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Updates the corresponding job',
  })
  @ApiOkResponse({ type: JobDto })
  @ApiAppBadRequestResponse()
  @ApiAppNotFoundResponse()
  @OwnerIdGuard()
  update(
    @OwnerId() ownerId: string,
    @IntParam('id') id: number,
    @Body() data: PatchJobDto,
  ): Promise<JobDto> {
    return this.jobsService.update({
      where: { ownerId, id },
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
  @OwnerIdGuard()
  remove(
    @OwnerId() ownerId: string,
    @IntParam('id') id: number,
  ): Promise<JobDto> {
    return this.jobsService.remove({ ownerId, id });
  }
}
