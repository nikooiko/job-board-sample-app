import { User } from '@app/users/prisma-client';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';
import { IsAppEmail } from '@app/core/api/decorators/is-app-email.decorator';

export class CreateUserDto
  implements Omit<User, 'id' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty()
  @IsAppEmail()
  email: string;
  @ApiProperty()
  @IsString()
  @IsStrongPassword()
  password: string;
}
