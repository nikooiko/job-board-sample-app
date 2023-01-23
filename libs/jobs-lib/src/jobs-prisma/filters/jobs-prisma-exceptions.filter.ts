import { Catch } from '@nestjs/common';
import { Prisma } from '@app/jobs/prisma-client';
import { PrismaExceptionsFilter } from '@app/core/prisma/filters/prisma-exceptions.filter';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.NotFoundError)
export class JobsPrismaExceptionsFilter extends PrismaExceptionsFilter {}
