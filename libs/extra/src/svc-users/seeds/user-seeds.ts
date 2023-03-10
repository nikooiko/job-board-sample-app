import { Prisma, PrismaClient } from '@app/users/prisma-client';
import bcrypt from 'bcrypt';

// Can you generate me uuid with 0?
//

export const userSeeds = async (prisma: PrismaClient) => {
  const users: Prisma.UserCreateManyInput[] = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'user1@jb-sample.app',
      password: await bcrypt.hash('user1Pass!', 10),
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'user2@jb-sample.app',
      password: await bcrypt.hash('user2Pass!', 10),
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      email: 'user3@jb-sample.app',
      password: await bcrypt.hash('user3Pass!', 10),
    },
  ];
  const profiles: Prisma.ProfileCreateManyInput[] = [
    {
      firstName: 'User1Fname',
      lastName: 'User1Lname',
      ownerId: users[0].id as string,
    },
    {
      firstName: 'User2Fname',
      lastName: 'User2Lname',
      ownerId: users[1].id as string,
    },
    {
      firstName: 'User3Fname',
      lastName: 'User3Lname',
      ownerId: users[2].id as string,
    },
  ];
  await prisma.user.createMany({
    data: users,
  });
  await prisma.profile.createMany({ data: profiles });
};
