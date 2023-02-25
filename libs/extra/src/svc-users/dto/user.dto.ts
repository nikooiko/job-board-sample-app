import { User } from '@app/users/prisma-client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsUUID } from 'class-validator';

export class UserDto implements Omit<User, 'password'> {
  @ApiProperty()
  @IsUUID()
  id: string;
  @ApiProperty()
  @IsString()
  email: string;
  @ApiProperty()
  @IsDate()
  createdAt: Date;
  @ApiProperty()
  @IsDate()
  updatedAt: Date;
}
