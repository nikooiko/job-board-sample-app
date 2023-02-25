import { User } from '@app/users/prisma-client';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsAppEmail } from '@app/core/api/decorators/is-app-email.decorator';

export class UserCredentialsDto
  implements Omit<User, 'id' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty()
  @IsAppEmail()
  email: string;
  @ApiProperty()
  @IsString()
  password: string;
}
