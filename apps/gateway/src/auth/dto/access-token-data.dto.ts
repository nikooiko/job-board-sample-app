import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { UserDto } from '@app/extra/svc-users/dto/user.dto';

export class AccessTokenDataDto implements Partial<UserDto> {
  @ApiProperty()
  @IsUUID()
  id: string;
}
