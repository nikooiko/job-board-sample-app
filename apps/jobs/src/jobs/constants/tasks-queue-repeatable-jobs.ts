import { CronRepeatOptions, JobOptions } from 'bull';

export const SYNC_JOBS_WITH_SEARCH_TASK = {
  name: 'sync-jobs-with-search',
  data: {},
  options: {
    jobId: 'sync-jobs-with-search',
    removeOnComplete: 3,
    removeOnFail: 10,
    repeat: {
      cron: '*/10 * * * *', // every 10 minutes (https://crontab.guru/#*/10_*_*_*_*)
    },
  },
};

export const TASKS_QUEUE_REPEATABLE_JOBS: {
  name: string;
  data: any;
  options: JobOptions & { repeat: CronRepeatOptions };
}[] = [SYNC_JOBS_WITH_SEARCH_TASK];
