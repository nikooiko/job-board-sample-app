import { Inject, Injectable } from '@nestjs/common';
import { JobDto } from '@app/extra/jobs/dto/job.dto';
import { ListJobDto } from '@app/extra/jobs/dto/list-job.dto';
import { LOGGER } from '@app/core/logger/factories/logger.factory';
import { Logger } from 'winston';
import { ElasticsearchService } from '@app/extra/elasticsearch/services/elasticsearch.service';
import { SearchJobsQueryDto } from '@app/extra/jobs/dto/search-jobs-query.dto';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import { AppBadRequestException } from '@app/core/error-handling/exceptions/app-bad-request.exception';
import { ResponseError } from '@elastic/transport/lib/errors';
import { AppNotFoundException } from '@app/core/error-handling/exceptions/app-not-found.exception';
import { jobsIndex } from '../indices/jobs.index';
import { dtoToSearchConverter } from '../converters/dto-to-search.converter';
import { SearchJobDoc } from '../interfaces/search-job-doc.interface';
import { searchToDtoConverter } from '../converters/search-to-dto.converter';

@Injectable()
export class JobsService {
  constructor(
    @Inject(LOGGER) private logger: Logger,
    private elasticsearchService: ElasticsearchService,
  ) {}

  async init() {
    await this.elasticsearchService.checkOrCreateIndex(jobsIndex); // always resolves
  }

  async search(params: SearchJobsQueryDto): Promise<ListJobDto> {
    const { page, limit, searchText, employmentType, salaryFrom, salaryTo } =
      params;
    const filter: QueryDslQueryContainer[] = [];
    if (searchText) {
      filter.push({
        multi_match: {
          query: searchText,
          fields: ['title', 'description'],
        },
      });
    }
    if (employmentType) {
      filter.push({
        term: {
          employment_type: employmentType,
        },
      });
    }
    if (salaryFrom) {
      filter.push({
        range: {
          salary: {
            gte: salaryFrom,
          },
        },
      });
    }
    if (salaryTo) {
      filter.push({
        range: {
          salary: {
            lte: salaryTo,
          },
        },
      });
    }
    const query: QueryDslQueryContainer = {
      bool: {
        filter,
      },
    };
    const { hits } = await this.elasticsearchService.search<SearchJobDoc>({
      index: jobsIndex.index,
      query,
      from: page * limit,
      size: limit,
      rest_total_hits_as_int: false,
    });
    const count: number =
      typeof hits.total === 'object' ? hits.total.value : hits.total || 0;
    this.logger.debug('Search jobs result', {
      type: 'SEARCH_JOB_RESULTS',
      hits,
      params,
      query,
    });
    return {
      items: hits.hits.map((hit) =>
        searchToDtoConverter(hit._source as SearchJobDoc),
      ),
      limit,
      count,
      pages: Math.ceil(count / limit),
    };
  }

  async upsert(job: JobDto): Promise<void> {
    await this.elasticsearchService.index({
      index: jobsIndex.index,
      id: job.id.toString(),
      document: dtoToSearchConverter(job),
    });
    this.logger.info('Upsert job', { type: 'SEARCH_JOB_UPSERT', job });
  }

  async remove(id: number): Promise<void> {
    try {
      await this.elasticsearchService.delete({
        index: jobsIndex.index,
        id: id.toString(),
      });
    } catch (err) {
      if (err instanceof ResponseError) {
        if (err.meta.statusCode === 404) {
          this.logger.warn('Job not found', {
            type: 'SEARCH_JOB_NOT_FOUND',
            id,
          });
          throw new AppNotFoundException();
        } else if (err.meta.statusCode && err.meta.statusCode < 500) {
          this.logger.error('Failed to delete job', {
            type: 'SEARCH_JOB_DELETE_ERROR',
            id,
            err,
          });
          throw new AppBadRequestException();
        }
      }
      throw err;
    }
    this.logger.info('Deleted job', { type: 'SEARCH_JOB_DELETED', id });
  }
}
