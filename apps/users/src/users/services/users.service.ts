import { Inject, Injectable } from '@nestjs/common';
import { Prisma, User } from '@app/users/prisma-client';
import { LOGGER } from '@app/core/logger/factories/logger.factory';
import { Logger } from 'winston';
import bcrypt from 'bcrypt';
import { ConfigType } from '@nestjs/config';
import { AppUnauthorizedException } from '@app/core/error-handling/exceptions/app-unauthorized.exception';
import { UserCredentialsDto } from '@app/extra/svc-users/dto/user-credentials.dto';
import { UsersPrismaService } from '../../users-prisma/services/users-prisma.service';
import usersConfig from '../config/users.config';

@Injectable()
export class UsersService {
  constructor(
    @Inject(usersConfig.KEY)
    public readonly config: ConfigType<typeof usersConfig>,
    private prisma: UsersPrismaService,
    @Inject(LOGGER) private logger: Logger,
  ) {}

  async findOne(where: Prisma.UserWhereInput): Promise<Omit<User, 'password'>> {
    return this.prisma.user.findFirstOrThrow({
      select: { id: true, email: true, createdAt: true, updatedAt: true },
      where,
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
    const { password: unencryptedPassword, ...restData } = data;
    const user = await this.prisma.user.create({
      data: {
        ...restData,
        password: await this.hashPassword(unencryptedPassword),
      },
    });
    this.logger.info('User created', {
      type: 'USER_CREATED',
      email: user.email,
    });
    const { password: drop, ...userWithoutPass } = user; // omit password
    return userWithoutPass;
  }

  async validateCredentials({
    email,
    password,
  }: UserCredentialsDto): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppUnauthorizedException('Invalid credentials');
    }
    const { password: drop, ...userWithoutPass } = user; // omit password
    return userWithoutPass;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.config.password.saltOrRounds);
  }
}
