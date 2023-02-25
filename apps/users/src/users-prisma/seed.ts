import { PrismaClient } from '@app/users/prisma-client';
import { userSeeds } from '@app/extra/svc-users/seeds/user-seeds';

const prisma = new PrismaClient();

async function main() {
  let exitStatus = 0;
  try {
    await userSeeds(prisma);
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
