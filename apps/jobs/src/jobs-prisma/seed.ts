import { PrismaClient } from '@app/jobs/prisma-client';
import { jobSeeds } from '@app/extra/svc-jobs/seeds/job-seeds';

const prisma = new PrismaClient();

async function main() {
  let exitStatus = 0;
  try {
    await jobSeeds(prisma);
    console.log('Seed finished successfully');
  } catch (err) {
    console.error(err);
    exitStatus = 1;
  } finally {
    await prisma.$disconnect();
  }
  process.exit(exitStatus);
}

main();
