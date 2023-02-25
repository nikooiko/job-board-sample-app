import { User } from '@app/users/prisma-client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserCredentialsDto
  implements Omit<User, 'id' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  password: string;
}
