import { PartialType } from '@nestjs/swagger';
import { CreateJobDto } from '@app/extra/svc-jobs/dto/create-job.dto';

export class PatchJobDto extends PartialType(CreateJobDto) {}
