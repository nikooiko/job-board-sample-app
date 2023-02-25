import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { User } from '@app/users/prisma-client';
import { IsAppEmail } from '@app/core/api/decorators/is-app-email.decorator';

export class LoginDto implements Partial<User> {
  @ApiProperty()
  @IsAppEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
